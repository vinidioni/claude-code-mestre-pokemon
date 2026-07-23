-- ============================================================================
-- QUERY PRESTO: GROCERIES ORDERS (Aftersales via refund > 0)
-- ============================================================================
-- Versão para Presto/Trino
-- Correção: Usar refund > 0 em vez de is_crefund = 1
-- ============================================================================
-- Parâmetros:
--   ${initial_date} - Data inicial (yyyy-MM-dd)
--   ${final_date}   - Data final (yyyy-MM-dd)
-- ============================================================================

WITH

cancel_causes AS (
    SELECT
        order_id,
        MIN(cancel_detail_reason) AS cancel_detail_reason,
        MAX(CASE WHEN status = 942 THEN 1 ELSE 0 END) AS is_ua_cancel
    FROM soda_international_dw_br.dwd_order_cancel_duty_d_increment
    GROUP BY order_id
),

OL_list AS (
    SELECT
        rider_id,
        date_format(begin_time_local, '%Y-%m-%d') AS stat_date,
        MAX(CASE
            WHEN vendor_id IS NOT NULL THEN 'OL'
            ELSE 'cloud'
        END) AS ol_status
    FROM soda_international_dw_br.dwd_rider_shift_record_d_whole
    WHERE country_code = 'BR'
        AND date_format(begin_time_local, '%Y-%m-%d') BETWEEN '${initial_date}' AND '${final_date}'
    GROUP BY
        rider_id,
        date_format(begin_time_local, '%Y-%m-%d')
),

schedule AS (
    SELECT
        rider_id,
        CAST(year AS VARCHAR(4)) || '-' || LPAD(CAST(month AS VARCHAR(2)), 2, '0') || '-' || LPAD(CAST(day AS VARCHAR(2)), 2, '0') AS stat_date,
        1 AS schedule
    FROM soda_international_dw_br.dwd_rider_shift_record_d_whole
    WHERE country_code = 'BR'
        AND CAST(year AS VARCHAR(4)) || '-' || LPAD(CAST(month AS VARCHAR(2)), 2, '0') || '-' || LPAD(CAST(day AS VARCHAR(2)), 2, '0') BETWEEN '${initial_date}' AND '${final_date}'
    GROUP BY
        rider_id,
        CAST(year AS VARCHAR(4)) || '-' || LPAD(CAST(month AS VARCHAR(2)), 2, '0') || '-' || LPAD(CAST(day AS VARCHAR(2)), 2, '0')
),

shop_category AS (
    SELECT
        shop_id,
        MIN(gcy_sub_biz_line) AS main_category_en
    FROM soda_international_dw_br.dwd_shop_base_d_whole
    WHERE business_type = 3
    GROUP BY shop_id
),

order_base AS (
    SELECT
        CAST(a.year AS VARCHAR(4)) || '-' || LPAD(CAST(a.month AS VARCHAR(2)), 2, '0') || '-' || LPAD(CAST(a.day AS VARCHAR(2)), 2, '0') AS stat_date,
        r.city_name,
        a.order_id,
        a.biz_line,
        a.rider_id,
        COALESCE(ol.ol_status, 'cloud')        AS ol_status,
        COALESCE(sch.schedule, 0)              AS schedule_status,
        CASE WHEN a.is_multi = 1 THEN 1 ELSE 0 END AS pooling_status,
        CASE
            WHEN a.r_vehicle_type IN (102, 105) THEN 'moto'
            WHEN a.r_vehicle_type IN (101, 103) THEN 'bike'
            WHEN a.r_vehicle_type = 104         THEN 'car'
            ELSE 'other'
        END AS vehicle,
        cc.cancel_detail_reason,
        CASE
            WHEN a.status = 901 THEN 'Canceled by customer'
            WHEN a.status = 902 THEN 'Cancelled by system due to payment error'
            WHEN a.status = 921 THEN 'Canceled by store'
            WHEN a.status = 922 THEN 'Store timeout'
            WHEN a.status = 941 THEN 'Canceled by courier'
            WHEN a.status = 942 THEN 'Canceled because no courier accepted'
            WHEN a.status = 945 THEN 'Canceled by courier'
            WHEN a.status = 961 THEN 'Canceled by customer service'
            ELSE 'Not canceled'
        END AS cancellation_operator,
        CASE
            WHEN a.e_dutyinfo_b_responsibility = '100' THEN 'b-duty'
            WHEN a.e_dutyinfo_c_responsibility = '100' THEN 'c-duty'
            WHEN a.e_dutyinfo_d_responsibility = '100' THEN 'd-duty'
            WHEN a.e_dutyinfo_p_responsibility = '100' THEN 'p-duty'
            ELSE NULL
        END AS duty,
        sc.main_category_en,
        a.is_td_pay,
        a.is_td_cancel,
        a.is_td_complete,
        a.refund_price,
        a.order_price,
        CASE
            WHEN cc.is_ua_cancel = 1 AND (a.rider_id IS NULL OR a.rider_id = 0)
            THEN 1 ELSE 0
        END AS is_ua
    FROM soda_international_dw_br.dwd_order_wide_d_increment a
    LEFT JOIN latam_99.dim_regional r
        ON a.city_id = r.city_id
    LEFT JOIN cancel_causes cc
        ON a.order_id = cc.order_id
    LEFT JOIN OL_list ol
        ON a.rider_id = ol.rider_id
        AND ol.stat_date = CAST(a.year AS VARCHAR(4)) || '-' || LPAD(CAST(a.month AS VARCHAR(2)), 2, '0') || '-' || LPAD(CAST(a.day AS VARCHAR(2)), 2, '0')
    LEFT JOIN schedule sch
        ON a.rider_id = sch.rider_id
        AND sch.stat_date = CAST(a.year AS VARCHAR(4)) || '-' || LPAD(CAST(a.month AS VARCHAR(2)), 2, '0') || '-' || LPAD(CAST(a.day AS VARCHAR(2)), 2, '0')
    LEFT JOIN shop_category sc
        ON a.shop_id = sc.shop_id
    WHERE
        a.country_code  = 'BR'
        AND a.delivery_type = 1
        AND a.pay_status > 0
        AND a.channel   = 0
        AND CAST(a.year AS VARCHAR(4)) || '-' || LPAD(CAST(a.month AS VARCHAR(2)), 2, '0') || '-' || LPAD(CAST(a.day AS VARCHAR(2)), 2, '0') BETWEEN '${initial_date}' AND '${final_date}'
        AND a.biz_line = 3
        AND r.city_name IN ('Goiânia', 'São Paulo')
)

SELECT
    stat_date,
    city_name,
    biz_line,
    ol_status,
    schedule_status,
    pooling_status,
    vehicle,
    cancel_detail_reason,
    cancellation_operator,
    duty,
    main_category_en,
    COUNT(DISTINCT CASE WHEN is_td_pay = 1 THEN order_id END) AS paid_orders,
    COUNT(DISTINCT CASE WHEN is_td_cancel = 1 THEN order_id END) AS cancel_orders,
    COUNT(DISTINCT CASE WHEN is_td_complete = 1 AND refund_price > 0 THEN order_id END) AS total_aftersales,
    SUM(CASE WHEN is_td_pay = 1 THEN order_price END)       AS paid_value,
    SUM(CASE WHEN is_td_cancel = 1 THEN order_price END)    AS cancel_value,
    SUM(CASE WHEN is_td_complete = 1 AND refund_price > 0 THEN refund_price END) AS aftersales_value,
    COUNT(DISTINCT CASE WHEN is_ua = 1 THEN order_id END) AS total_ua
FROM order_base
GROUP BY
    stat_date,
    city_name,
    biz_line,
    ol_status,
    schedule_status,
    pooling_status,
    vehicle,
    cancel_detail_reason,
    cancellation_operator,
    duty,
    main_category_en
ORDER BY
    stat_date,
    city_name;
