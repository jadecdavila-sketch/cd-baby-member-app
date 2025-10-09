export async function preauthPayment(
  stateData: any,
  accessToken: string | undefined
) {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_SERVICE_URL}/api/payments/preauth`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        UserId: 1,
        Amount: 75.0,
        PaymentMethodType: 5,
        SavePaymentOption: 1,
        ModifiedBy: 'Centro',
        PaymentRequestContent: JSON.stringify(stateData),
      }),
    }
  ).then((res) => res.json());
}

export async function voidPayment(transactionId: any) {
  return fetch(`${process.env.NEXT_PUBLIC_API_SERVICE_URL}/api/payments/void`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      UserId: 1,
      TransactionId: transactionId,
      PaymentMethodType: 5,
    }),
  }).then((res) => res.json());
}

export async function createSalesOrder(
  transactionId: string,
  accessToken: string | undefined
) {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_SERVICE_URL}/api/salesorders/save`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        Header: {
          UserId: 1,
          SalesOrderStatusId: 2,
          TotalQuantity: 1,
          TotalAmount: 75.0,
          TotalDiscountAmount: 0,
          CouponCodeId: null,
          CreatedBy: 'AdminUser',
        },
        Items: [
          {
            ServiceItemId: 1,
            CouponCodeId: null,
            SalesOrderLineNum: 1,
            Quantity: 1,
            UnitPrice: 75.0,
            UnitPriceDiscountAmount: 0,
            LineAmount: 75.0,
            CreatedBy: 'AdminUser',
            SalesOrderDetailItemTypeId: 0,
            SalesOrderDetailReferenceId: 11111,
          },
        ],
        Payment: {
          UserId: 1,
          PaymentMethodId: 5,
          PaymentActionId: 1,
          PaymentStatusId: 1,
          PaymentAmount: 75.0,
          TransactionId: transactionId,
          ModifiedBy: 'AdminUser',
        },
      }),
    }
  ).then((res) => res.json());
}
