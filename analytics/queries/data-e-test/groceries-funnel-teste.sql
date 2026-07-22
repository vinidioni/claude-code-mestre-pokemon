-- ============================================================================
-- QUERY DATA-E: FUNIL DE ORDERS GROCERIES (biz_line=3) - VERSÃO DE TESTE
-- ============================================================================
-- Esta é a versão COM variáveis parametrizadas para teste local
-- Para uso no Data-E, use o arquivo groceries-funnel.sql (sem parametrização)
-- ============================================================================
-- Parâmetros:
--   ${start_date} - Data inicial (ex: 2026-07-01)
--   ${end_date}   - Data final (ex: 2026-07-13)
--
-- Exemplo: start_date=2026-07-01, end_date=2026-07-13
-- Total esperado: ~3078 paid orders por dia (Goiânia + São Paulo)
-- ============================================================================

SELECT
    stat_date,
    city_name,
    schedule_status,
    pooling_status,
    vehicle_type,
    work_type,
    rider_type,
    incentive_type,

    -- Métricas de Orders
    COUNT(DISTINCT CASE WHEN is_td_pay = 1 THEN order_id END) AS total_paid_orders,
    COUNT(DISTINCT CASE WHEN is_td_pay = 1 AND pay_channel = 153 THEN order_id END) AS total_paid_orders_cash,
    COUNT(DISTINCT CASE WHEN is_td_complete = 1 THEN order_id END) AS total_completed_orders,
    COUNT(DISTINCT CASE WHEN is_td_cancel = 1 THEN order_id END) AS total_canceled_orders,
    COUNT(DISTINCT CASE WHEN is_td_complete = 1 AND crefund_status > 0 THEN order_id END) AS total_aftersales,

    -- UA: cancelada por falta de courier aceitar (status 942) e sem rider atribuído
    COUNT(DISTINCT CASE WHEN is_ua = 1 THEN order_id END) AS total_ua,

    -- Duty Types
    COUNT(DISTINCT CASE WHEN e_dutyinfo_b_responsibility = '100' THEN order_id END) AS total_b_duty,
    COUNT(DISTINCT CASE WHEN e_dutyinfo_c_responsibility = '100' THEN order_id END) AS total_c_duty,
    COUNT(DISTINCT CASE WHEN e_dutyinfo_d_responsibility = '100' THEN order_id END) AS total_d_duty,
    COUNT(DISTINCT CASE WHEN e_dutyinfo_p_responsibility = '100' THEN order_id END) AS total_p_duty

FROM (
    -- ============================================================================
    -- BASE DE ORDERS COM JOINS NECESSÁRIOS (DEDUPLICADA)
    -- ============================================================================
    SELECT
        stat_date,
        city_name,
        order_id,
        rider_id,
        schedule_status,
        pooling_status,
        vehicle_type,
        work_type,
        rider_type,
        incentive_type,
        is_td_pay,
        is_td_cancel,
        is_td_complete,
        crefund_status,
        pay_channel,
        e_dutyinfo_b_responsibility,
        e_dutyinfo_c_responsibility,
        e_dutyinfo_d_responsibility,
        e_dutyinfo_p_responsibility,
        is_ua,
        -- Prioriza registros com duty info preenchido, depois com rider, depois aleatório
        ROW_NUMBER() OVER (
            PARTITION BY order_id
            ORDER BY
                CASE WHEN e_dutyinfo_d_responsibility IS NOT NULL THEN 0 ELSE 1 END,
                CASE WHEN rider_id IS NOT NULL AND rider_id != 0 THEN 0 ELSE 1 END,
                rider_id
        ) AS rn
    FROM (
        SELECT
            concat_ws('-', a.year, a.month, a.day) AS stat_date,
            r.city_name,
            a.order_id,
            a.rider_id,

            -- Schedule Status (0 ou 1)
            COALESCE(sch.schedule, 0) AS schedule_status,

            -- Pooling Status (0 ou 1)
            CASE WHEN a.is_multi = 1 THEN 1 ELSE 0 END AS pooling_status,

            -- UA: quando não há rider, vehicle_type é NULL
            CASE
                WHEN cc.is_ua_cancel = 1 AND (a.rider_id IS NULL OR a.rider_id = 0) THEN NULL
                WHEN a.r_vehicle_type IN (102, 105) THEN 'moto'
                WHEN a.r_vehicle_type IN (101, 103) THEN 'bike'
                WHEN a.r_vehicle_type = 104 THEN 'car'
                ELSE 'other'
            END AS vehicle_type,

            -- UA: quando não há rider, work_type é NULL
            CASE
                WHEN cc.is_ua_cancel = 1 AND (a.rider_id IS NULL OR a.rider_id = 0) THEN NULL
                WHEN rw.work_type = 1 THEN '99pro'
                WHEN rw.work_type = 2 THEN 'cloud'
                WHEN rw.work_type = 3 THEN 'ol'
                WHEN rw.work_type = 6 THEN 'shift'
                ELSE 'other'
            END AS work_type,

            -- UA: quando não há rider, rider_type é NULL
            CASE
                WHEN cc.is_ua_cancel = 1 AND (a.rider_id IS NULL OR a.rider_id = 0) THEN NULL
                WHEN COALESCE(acc.accepted_orders, 0) < 30 THEN 'new'
                WHEN COALESCE(acc.accepted_orders, 0) >= 30 AND COALESCE(acc.accepted_orders, 0) < 100 THEN 'maturing'
                WHEN COALESCE(acc.accepted_orders, 0) >= 100 THEN 'exp'
                ELSE 'new'
            END AS rider_type,

            -- UA: quando não há rider, incentive_type é NULL
            CASE
                WHEN cc.is_ua_cancel = 1 AND (a.rider_id IS NULL OR a.rider_id = 0) THEN NULL
                ELSE COALESCE(ops.driver_incentive_group, 'unknown')
            END AS incentive_type,

            -- Flags de Status
            a.is_td_pay,
            a.is_td_cancel,
            a.is_td_complete,
            a.crefund_status,
            a.pay_channel,

            -- Duty Responsibilities
            a.e_dutyinfo_b_responsibility,
            a.e_dutyinfo_c_responsibility,
            a.e_dutyinfo_d_responsibility,
            a.e_dutyinfo_p_responsibility,

            -- UA: cancelada por falta de courier aceitar (status 942) e sem rider atribuído
            CASE
                WHEN cc.is_ua_cancel = 1 AND (a.rider_id IS NULL OR a.rider_id = 0)
                THEN 1 ELSE 0
            END AS is_ua

        FROM soda_international_dw_br.dwd_order_wide_d_increment a

    -- Join com dimensão de cidade
    LEFT JOIN latam_99.dim_regional r
        ON r.city_id = a.city_id

    -- Join com cancel causes para UA
    LEFT JOIN (
        SELECT
            order_id,
            MAX(CASE WHEN status = 942 THEN 1 ELSE 0 END) AS is_ua_cancel
        FROM soda_international_dw_br.dwd_order_cancel_duty_d_increment
        GROUP BY order_id
    ) cc
        ON cc.order_id = a.order_id

    -- Join com Schedule (subquery)
    LEFT JOIN (
        SELECT
            rider_id,
            concat_ws('-', year, month, day) AS stat_date,
            1 AS schedule
        FROM soda_international_dw_br.dwd_rider_shift_record_d_whole
        WHERE country_code = 'BR'
        GROUP BY rider_id, concat_ws('-', year, month, day)
    ) sch
        ON sch.rider_id = a.rider_id
        AND sch.stat_date = concat_ws('-', a.year, a.month, a.day)

    -- Join com Work Type da tabela de riders (pré-agregado para evitar duplicatas)
    LEFT JOIN (
        SELECT
            rider_id,
            concat_ws('-', year, month, day) AS stat_date,
            MAX(work_type) AS work_type
        FROM soda_international_dw_br.dwd_rider_whole_d_whole
        WHERE country_code = 'BR'
        GROUP BY rider_id, concat_ws('-', year, month, day)
    ) rw
        ON rw.rider_id = a.rider_id
        AND rw.stat_date = concat_ws('-', a.year, a.month, a.day)

    -- Join com Accepted Orders para classificação do rider (subquery)
    LEFT JOIN (
        SELECT
            rider_id,
            COUNT(DISTINCT delivery_id) AS accepted_orders
        FROM soda_international_dw_br.dwd_d_delivery_log_d_increment
        WHERE status = 120
            AND concat_ws('-', year, month, day) < '${end_date}'
            AND concat_ws('-', year, month, day) >= date_sub('${end_date}', 180)
            AND country_code = 'BR'
        GROUP BY rider_id
    ) acc
        ON acc.rider_id = a.rider_id

    -- Join com driver_incentive_group (pré-agregado para evitar duplicatas)
    LEFT JOIN (
        SELECT
            driver_id,
            city_id,
            dt,
            MAX(driver_incentive_group) AS driver_incentive_group
        FROM brazil_food.courier_matrix_classification
        WHERE country_code = 'BR'
        GROUP BY driver_id, city_id, dt
    ) ops
        ON ops.driver_id = a.rider_id
        AND ops.city_id = a.city_id
        AND ops.dt = concat_ws('-', a.year, a.month, a.day)

    WHERE
        a.country_code = 'BR'
        AND a.delivery_type = 1
        AND a.pay_status > 0
        AND a.channel = 0
        AND a.biz_line = 3
        AND concat_ws('-', a.year, a.month, a.day) >= '${start_date}'
        AND concat_ws('-', a.year, a.month, a.day) <= '${end_date}'
        AND r.city_name IN ('Goiânia', 'São Paulo')
    ) inner_base
) base
WHERE rn = 1

GROUP BY
    stat_date,
    city_name,
    schedule_status,
    pooling_status,
    vehicle_type,
    work_type,
    rider_type,
    incentive_type

ORDER BY
    stat_date,
    city_name,
    schedule_status,
    pooling_status,
    vehicle_type,
    work_type,
    rider_type,
    incentive_type;
