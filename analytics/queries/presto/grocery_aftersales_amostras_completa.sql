-- ============================================================-- Amostras Completas de Order IDs - Todos os Cenários-- Status descritivos + Reembolso-- ============================================================

WITH tickets_grocery_aftersales AS (
    SELECT
        ticketid,
        order_id AS ticket_order_id,
        to_date(local_create_time) AS contact_date,
        local_create_time AS ticket_create_time,
        cr_lv4_name,
        requester_id AS uid
    FROM International_capital.dwd_crm_ticket_capital_di
    WHERE
        pt >= date_format(date_sub('${START}', 60), 'yyyyMMdd')
        AND TO_DATE(local_create_time) BETWEEN DATE_SUB('${START}', 60) AND DATE_ADD('${END}', 30)
        AND country_code IN ('BR')
        AND cr_lv3_name = 'After sales issues'
        AND customer_type = 'Customer'
        AND is_auto = 0
        AND is_pdg_nego = 0
        AND business_unit <> 'BU_Test'
        AND UPPER(TRIM(english_description)) NOT LIKE '%TEST%'
        AND (
            UPPER(TRIM(business_type_name)) LIKE '%GROCERY%'
            OR UPPER(TRIM(business_type_name)) LIKE '%99COMPRAS%'
            OR UPPER(TRIM(business_type_name)) LIKE '%GROCER%'
        )
        AND organization_name = 'Delivery Services'
),

-- Status das Orders com MAPEAMENTO DESCRITIVO
order_details AS (
    SELECT
        a.order_id,
        a.status AS status_num,
        -- Status categoria
        CASE
            WHEN a.is_td_complete = 1 THEN 'COMPLETADA'
            WHEN a.is_td_cancel = 1 THEN 'CANCELADA'
            ELSE 'OUTRO'
        END AS order_completion_status,
        -- Status descritivo detalhado
        CASE
            -- Completadas
            WHEN a.is_td_complete = 1 THEN 'COMPLETADA'
            -- Canceladas
            WHEN a.is_td_cancel = 1 THEN
                CASE a.status
                    WHEN 901 THEN 'CANCELADA-Cliente'
                    WHEN 902 THEN 'CANCELADA-Erro pagamento'
                    WHEN 921 THEN 'CANCELADA-Loja'
                    WHEN 922 THEN 'CANCELADA-Timeout loja'
                    WHEN 941 THEN 'CANCELADA-Courier'
                    WHEN 942 THEN 'CANCELADA-Sem courier (UA)'
                    WHEN 945 THEN 'CANCELADA-Courier'
                    WHEN 961 THEN 'CANCELADA-Atendimento'
                    ELSE 'CANCELADA-Outro'
                END
            -- Outros (em andamento)
            ELSE
                CASE a.status
                    WHEN 100 THEN 'OUTRO-Criada'
                    WHEN 110 THEN 'OUTRO-Aguardando pagamento'
                    WHEN 120 THEN 'OUTRO-Paga (confirmação)'
                    WHEN 130 THEN 'OUTRO-Confirmada (buscando rider)'
                    WHEN 140 THEN 'OUTRO-Rider atribuído'
                    WHEN 150 THEN 'OUTRO-Rider a caminho loja'
                    WHEN 160 THEN 'OUTRO-Rider na loja'
                    WHEN 170 THEN 'OUTRO-Rider com pedido'
                    WHEN 180 THEN 'OUTRO-A caminho cliente'
                    WHEN 190 THEN 'OUTRO-Entregue (finalizando)'
                    ELSE CONCAT('OUTRO-Status ', CAST(a.status AS STRING))
                END
        END AS status_descritivo,
        a.cancel_time_local,
        a.complete_time_local,
        a.crefund_status,
        r.city_name
    FROM soda_international_dw_br.dwd_order_wide_d_increment a
    LEFT JOIN latam_99.dim_regional r ON a.city_id = r.city_id
    WHERE a.country_code = 'BR'
      AND concat_ws('-', a.year, a.month, a.day) >= date_sub('${START}', 60)
      AND a.biz_line = 3
),

-- Reembolsos
refund_data AS (
    SELECT
        order_id AS refund_order_id,
        real_refund_price / 100 AS real_refund_price,
        apply_refund_price / 100 AS apply_refund_price,
        CASE
            WHEN result_type IN (2, 600, 3, 700, 4, 800) THEN 'COM_REEMBOLSO_APROVADO'
            WHEN result_type IN (1, 500) THEN 'REEMBOLSO_REJEITADO'
            WHEN result_type IN (0) THEN 'REEMBOLSO_NAO_PROCESSADO'
            ELSE 'REEMBOLSO_OUTRO'
        END AS refund_status,
        CASE operator_type
            WHEN 2 THEN 'Merchant'
            WHEN 4 THEN 'CSR'
            WHEN 5 THEN 'System'
            ELSE 'Other'
        END AS operator_type_desc
    FROM (
        SELECT
            *,
            ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY create_time_local DESC, update_time_local DESC) AS rk
        FROM soda_international_dw_br.dwd_order_refund_apply_d_increment
        WHERE country_code IN ('BR')
          AND complainant = 1
          AND apply_type IN (3, 4)
          AND concat_ws('-', year, month, day) BETWEEN DATE_SUB('${START}', 60) AND DATE_ADD('${END}', 30)
    ) sub
    WHERE rk = 1
),

-- Join principal com ranking
amostras AS (
    SELECT
        t.ticketid,
        t.ticket_order_id,
        t.ticket_create_time,
        t.cr_lv4_name,
        COALESCE(o.status_descritivo, 'ORDER_NAO_ENCONTRADA') AS status_descritivo,
        COALESCE(o.order_completion_status, 'ORDER_NAO_ENCONTRADA') AS status_categoria,
        CASE
            WHEN r.refund_order_id IS NULL THEN 'SEM_REEMBOLSO'
            ELSE r.refund_status
        END AS status_reembolso,
        COALESCE(o.city_name, 'N/A') AS city_name,
        o.status_num,
        r.real_refund_price,
        r.operator_type_desc,
        -- Ranking para pegar 5 de cada cenário
        ROW_NUMBER() OVER (
            PARTITION BY
                COALESCE(o.status_descritivo, 'ORDER_NAO_ENCONTRADA'),
                CASE
                    WHEN r.refund_order_id IS NULL THEN 'SEM_REEMBOLSO'
                    ELSE r.refund_status
                END
            ORDER BY t.ticket_create_time DESC
        ) AS rn
    FROM tickets_grocery_aftersales t
    LEFT JOIN order_details o ON t.ticket_order_id = o.order_id
    LEFT JOIN refund_data r ON t.ticket_order_id = r.refund_order_id
)

-- ============================================================
-- AMOSTRAS: 5 exemplos de cada cenário
-- ============================================================
SELECT
    status_categoria,
    status_descritivo,
    status_reembolso,
    ticket_order_id,
    city_name,
    ticket_create_time,
    cr_lv4_name,
    real_refund_price,
    operator_type_desc,
    status_num,
    rn AS amostra_numero
FROM amostras
WHERE rn <= 5
ORDER BY
    status_categoria,
    status_descritivo,
    status_reembolso,
    rn;
