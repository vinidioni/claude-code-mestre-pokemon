-- ============================================================
-- Análise dos 3 Cenários de Aftersales - Groceries/99Compras
-- ============================================================
-- Ticket aftersales + Order NÃO completada
-- Ticket aftersales + SEM reembolso
-- Ticket aftersales + COM reembolso
-- ============================================================

-- Tickets Aftersales Groceries
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

-- Status das Orders
order_details AS (
    SELECT
        order_id,
        status AS order_status,
        CASE
            WHEN is_td_complete = 1 THEN 'COMPLETADA'
            WHEN is_td_cancel = 1 THEN 'CANCELADA'
            ELSE 'OUTRO'
        END AS order_completion_status,
        cancel_time_local,
        complete_time_local,
        crefund_status
    FROM soda_international_dw_br.dwd_order_wide_d_increment
    WHERE country_code = 'BR'
      AND concat_ws('-', year, month, day) >= date_sub('${START}', 60)
      AND biz_line = 3
),

-- Reembolsos
refund_data AS (
    SELECT
        order_id AS refund_order_id,
        real_refund_price / 100 AS real_refund_price,
        CASE
            WHEN result_type IN (2, 600, 3, 700, 4, 800) THEN 'REEMBOLSO_APROVADO'
            WHEN result_type IN (1, 500) THEN 'REEMBOLSO_REJEITADO'
            WHEN result_type IN (0) THEN 'NAO_PROCESSADO'
            ELSE 'OUTRO'
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
)

-- ============================================================
-- MATRIZ: Cruzamento de Order Status x Reembolso
-- ============================================================
SELECT
    COALESCE(o.order_completion_status, 'ORDER_NAO_ENCONTRADA') AS status_order,
    CASE
        WHEN r.refund_order_id IS NULL THEN 'SEM_REEMBOLSO'
        WHEN r.refund_status = 'REEMBOLSO_APROVADO' THEN 'COM_REEMBOLSO_APROVADO'
        WHEN r.refund_status = 'REEMBOLSO_REJEITADO' THEN 'REEMBOLSO_REJEITADO'
        ELSE 'REEMBOLSO_NAO_PROCESSADO'
    END AS status_reembolso,
    COUNT(DISTINCT t.ticketid) AS total_tickets,
    COUNT(DISTINCT t.ticket_order_id) AS total_orders,
    SUM(CASE WHEN r.refund_status = 'REEMBOLSO_APROVADO' THEN r.real_refund_price ELSE 0 END) AS total_refunded_amount,
    ROUND(AVG(CASE WHEN r.refund_status = 'REEMBOLSO_APROVADO' THEN r.real_refund_price END), 2) AS avg_refund_valor
FROM tickets_grocery_aftersales t
LEFT JOIN order_details o
    ON t.ticket_order_id = o.order_id
LEFT JOIN refund_data r
    ON t.ticket_order_id = r.refund_order_id
GROUP BY
    COALESCE(o.order_completion_status, 'ORDER_NAO_ENCONTRADA'),
    CASE
        WHEN r.refund_order_id IS NULL THEN 'SEM_REEMBOLSO'
        WHEN r.refund_status = 'REEMBOLSO_APROVADO' THEN 'COM_REEMBOLSO_APROVADO'
        WHEN r.refund_status = 'REEMBOLSO_REJEITADO' THEN 'REEMBOLSO_REJEITADO'
        ELSE 'REEMBOLSO_NAO_PROCESSADO'
    END
ORDER BY total_tickets DESC;
