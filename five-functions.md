# Five Main Functions of the Food Delivery System

1.  **Menu Management:** Administrators can add, update, and remove food items from the menu.

    ```javascript
    // backend/controllers/foodController.js
    const addFood = async (req, res) => {
      let image_filename = `${req.file.filename}`;
      const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
      });
      try {
        await food.save();
        res.json({ success: true, message: "Food Added" });
      } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
      }
    };
    ```

2.  **Shopping Cart:** Customers can add or remove items from their shopping cart before checkout.

    ```javascript
    // backend/controllers/cartController.js
    const addToCart = async (req, res) => {
      try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if (!cartData[req.body.itemId]) {
          cartData[req.body.itemId] = 1;
        } else {
          cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Item added to cart" });
      } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
      }
    };
    ```

3.  **Order Placement & Payment:** Customers can place orders and complete payments securely via Stripe.

    ```javascript
    // backend/controllers/oderController.js
    const placeOrder = async (req, res) => {
      const frontend_url = process.env.FRONTEND_URL;
      try {
        const newOrder = new orderModel({
          userId: req.body.userId,
          items: req.body.items,
          amount: req.body.amount,
          address: req.body.address,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
          // ... price data configuration
        }));

        const session = await stripe.checkout.sessions.create({
          line_items: line_items,
          mode: "payment",
          success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
          cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });
        res.json({ success: true, success_url: session.url });
      } catch (error) {
        res.json({ success: false, message: "Error" });
      }
    };
    ```

4.  **Order Management:** The system allows administrators to view and update the status of customer orders.

    ```javascript
    // backend/controllers/oderController.js
    const updateStatus = async (req, res) => {
      try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {
          status: req.body.status,
        });
        res.json({ success: true, message: "Status Updated" });
      } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
      }
    };
    ```

5.  **Customer Communication:** Provides channels for customer support through a contact form and an integrated chatbot.
    ```javascript
    // backend/controllers/contactController.js
    const submitContactMessage = async (req, res) => {
      try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
          return res
            .status(400)
            .json({ success: false, message: "All fields are required" });
        }
        const created = await contactModel.create({ name, email, message });
        return res.json({
          success: true,
          message: "Message sent successfully",
          data: created,
        });
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: "Failed to send message" });
      }
    };
    ```
