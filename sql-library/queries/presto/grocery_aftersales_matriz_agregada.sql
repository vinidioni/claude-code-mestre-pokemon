-- ============================================================
-- Matriz Agregada: Status x Reembolso (13-19 Jul 2026)
-- ============================================================

WITH tickets_grocery_aftersales AS (
    SELECT
        ticketid,
        order_id AS ticket_order_id
    FROM International_capital.dwd_crm_ticket_capital_di
    WHERE
        TO_DATE(local_create_time) BETWEEN '2026-07-13' AND '2026-07-19'
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

order_details AS (
    SELECT
        a.order_id,
        a.status AS status_num,
        CASE
            WHEN a.is_td_complete = 1 THEN 'COMPLETADA'
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
        END AS status_descritivo
    FROM soda_international_dw_br.dwd_order_wide_d_increment a
    WHERE a.country_code = 'BR'
      AND concat_ws('-', a.year, a.month, a.day) BETWEEN '2026-07-13' AND '2026-07-19'
      AND a.biz_line = 3
),

refund_data AS (
    SELECT
        order_id AS refund_order_id,
        CASE
            WHEN result_type IN (2, 600, 3, 700, 4, 800) THEN 'COM_REEMBOLSO_APROVADO'
            WHEN result_type IN (1, 500) THEN 'REEMBOLSO_REJEITADO'
            WHEN result_type IN (0) THEN 'REEMBOLSO_NAO_PROCESSADO'
            ELSE 'REEMBOLSO_OUTRO'
        END AS refund_status
    FROM (
        SELECT
            *,
            ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY create_time_local DESC, update_time_local DESC) AS rk
        FROM soda_international_dw_br.dwd_order_refund_apply_d_increment
        WHERE country_code IN ('BR')
          AND complainant = 1
          AND apply_type IN (3, 4)
          AND concat_ws('-', year, month, day) BETWEEN '2026-07-13' AND '2026-07-19'
    ) sub
    WHERE rk = 1
)

-- ============================================================
-- MATRIZ AGREGADA
-- ============================================================
SELECT
    COALESCE(o.status_descritivo, 'ORDER_NAO_ENCONTRADA') AS status_descritivo,
    CASE
        WHEN r.refund_order_id IS NULL THEN 'SEM_REEMBOLSO'
        ELSE r.refund_status
    END AS status_reembolso,
    COUNT(DISTINCT t.ticketid) AS total_tickets,
    COUNT(DISTINCT t.ticket_order_id) AS total_orders
FROM tickets_grocery_aftersales t
LEFT JOIN order_details o ON t.ticket_order_id = o.order_id
LEFT JOIN refund_data r ON t.ticket_order_id = r.refund_order_id
GROUP BY
    COALESCE(o.status_descritivo, 'ORDER_NAO_ENCONTRADA'),
    CASE
        WHEN r.refund_order_id IS NULL THEN 'SEM_REEMBOLSO'
        ELSE r.refund_status
    END
ORDER BY total_tickets DESC;
