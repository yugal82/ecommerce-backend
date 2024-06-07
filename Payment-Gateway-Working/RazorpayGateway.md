<h2>How Payment Gateway Works</h2>

Understand the Razorpay Payment Gateway flow and how it works.

A Payment Gateway focuses on securing the sensitive information given by the user throughout the process. It ensures security by encrypting data like card and bank details provided by the user.
Given below is a complete end-to-end flow about how you can use Razorpay Payment Gateway. (image [fig 1] in directory)
![Payment/Order Flows](https://github.com/yugal82/ecommerce-backend/Payment-Gateway-Working/payment-flow-fig-1)

<hr>

**Step 1: Customer Places an Order**

A customer visits your website or app, selects items they want to purchase and clicks the pay button to place an order. For each order placed by your customer, you create a transaction_id or checkout_id on your server for your reference. For example, '#trn-345'.

<hr>

**Step 2: Create Order (Razorpay order) from Server**

For each order placed by your customer, use the Razorpay Orders API to create an order from your server.
-Orders APIs:
You can create Orders and link them to payments. Orders APIs are used to create, update and retrieve details of Orders. Also, you can retrieve details of payments made towards these Orders.

<hr>

**Step 3: Order ID Returned**

Razorpay processes the details sent and returns an order_id to you, for example, 'order_EKwxwAgItmmXdp'. Map this order_id to the transaction_id '#trn-345' you created in the first step.

    Know more about order states:

    -created: When a new order is created, it is in the created state. It stays in this state until payment is attempted on it.

    -attempted: An order moves from created to attempted state when payment is first attempted on it. It remains in the attempted state until a payment associated with that order is captured.

    -paid: After the payment is captured successfully, the order moves to the paid state. No further payment requests are allowed once the order moves to the paid state. The order continues to be in the paid state even if the payment associated with the order is refunded.

        Order and Payment Flows
        Following is a pictorial representation of how order and payment flows are closely related: (image [fig-2] in the directory)

![Payment/Order Flows](https://github.com/yugal82/ecommerce-backend/Payment-Gateway-Working/orders-payment-flow-fig-2)

<hr>

**Step 4: Pass Order ID to Checkout**

Pass the order_id returned by Razorpay to your integration. This invokes the Razorpay Checkout, the client-side UI, which displays various payment methods.

<hr>

**Step 5: Collect Payment Details**

The customer selects a payment option to complete the payment. The payment details entered by the customer are secured and stored by Razorpay as tokens. The generated tokens are exchanged with your servers for further use.

<hr>

**Step 6: Bank Authenticates the Payment**

Razorpay sends an authentication request to the customer's bank internally. After authentication, Razorpay is authorised to deduct the amount from the customer's bank account. For successful payments, the Checkout returns the razorpay_order_id, razorpay_payment_id and razorpay_signature.
-Know more about payment states.
Payment Life Cycle

    Following are the various states of a payment:

    -created: This is the first state. The customer has provided the payment details, which are sent to Razorpay . The payment has not been processed yet.

    -authorized: The payment state changes to authorized when the bank successfully authenticates the customer's payment details. The money is deducted from the customer’s account by Razorpay. The amount is settled to your account after the payment is manually or automatically captured. Payment in this state is auto-refunded to the customer if not captured within 3 days of creation.

    -captured: When the payment status is changed to captured , the payment is verified as complete by Razorpay . The amount is settled to your account as per the settlement schedule.

    -refunded: You can refund the payments that have been successfully captured at your end. The amount is reversed to the customer's account.

    -failed: An unsuccessful payment attempt is marked as failed , and the customer will have to retry the payment.

    The following state diagram depicts the flow of money through the various payment states: (image [fig-3] in directory)

![Payment States](https://github.com/yugal82/ecommerce-backend/Payment-Gateway-Working/payment-capture-payment-states-fig-3)
