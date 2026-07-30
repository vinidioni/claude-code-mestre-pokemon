# 📐 Data Definitions

> Official documentation of business concepts, metrics, and calculation rules.

---

## Order Status

**Table(s):** `dwd_order_wide_d_increment`, `dwd_order_cancel_duty_d_increment`

**Category:** Order

**Description:** Order status throughout its lifecycle (creation → payment → preparation → delivery → completion/cancellation)

### Status Codes

| Code | Status | Description |
|------|--------|-------------|
| **100** | CREATED | Order created in the system |
| **101** | CREATED_NOT_PAID | Order created, awaiting payment |
| **110** | CREATED_PAID | Order created and paid |
| **120** | ASSIGNED | Order assigned to a rider |
| **130** | ARRIVED_AT_STORE | Rider arrived at store for pickup |
| **140** | DISPATCHED | Order left the store (in transit) |
| **150** | ARRIVED_AT_CUSTOMER | Rider arrived at customer address |
| **160** | COMPLETED | Order successfully delivered |
| **170** | CANCELLED | Order cancelled (any reason) |
| **180** | REASSIGNED | Order reassigned to another rider |
| **190** | ERROR | Order processing error |
| **600** | IN_DELIVERY | Order in delivery process (intermediate status) |

### Cancellation Status Codes

| Code | Status | Responsibility |
|------|--------|----------------|
| **901** | Cancelled by customer | Customer (C duty) |
| **902** | Cancelled by system (payment error) | System |
| **921** | Cancelled by store | Business (B duty) |
| **922** | Store timeout | Business (B duty) |
| **941** | Cancelled by courier | Rider (D duty) |
| **942** | No courier accepted | UA (Unassigned) |
| **945** | Cancelled by courier | Rider (D duty) |
| **961** | Cancelled by customer service | Platform (P duty) |

**Source:** Validated queries + encyclopedia/tables.json  
**Status:** ✅ Validated  
**Last Updated:** 2026-07-29

---

## Aftersales

**Table(s):** `dwd_crm_ticket_capital_di`

**Category:** CX / Customer Support

**Description:** Support tickets opened by customers related to post-purchase issues with delivered orders.

### Definition Criteria

An aftersales ticket must meet all the following criteria:

```sql
SELECT *
FROM International_capital.dwd_crm_ticket_capital_di
WHERE country_code = 'BR'
  AND cr_lv3_name = 'After sales issues'
  AND requester_type = 1  -- Customer
  AND auto_type IN (1, 2)  -- Manual or System→Manual
  AND order_id IS NOT NULL
  AND pt >= '20250101'
```

### Final Order Outcome Calculation

To determine whether an order with an aftersales ticket was eventually completed or cancelled, use the following approach:

```sql
WITH orders_final_status AS (
    SELECT
        order_id,
        MAX(is_td_complete) AS eventually_completed,
        MAX(is_td_cancel) AS eventually_cancelled
    FROM soda_international_dw_br.dwd_order_wide_d_increment
    WHERE country_code = 'BR'
      AND delivery_type = 1
      AND channel = 0
      AND biz_line = 3
    GROUP BY order_id
)
SELECT
    CASE
        WHEN eventually_completed = 1 THEN 'ORDER_COMPLETED'
        WHEN eventually_cancelled = 1 THEN 'ORDER_CANCELLED'
    END AS order_final_outcome,
    COUNT(*)
FROM orders_final_status
GROUP BY ...
```

**Key Points:**
- The table `dwd_order_wide_d_increment` is incremental by day
- Use `MAX()` aggregation across all partitions to get the final state
- An order either completed or cancelled (mutually exclusive)

**Source:** Aftersales analysis (2026-07-29)  
**Status:** ✅ Validated  
**Last Updated:** 2026-07-29

---
