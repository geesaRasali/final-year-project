import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";

// Connect to MongoDB
await mongoose.connect("mongodb://localhost:27017/food-del");
console.log("Connected to MongoDB");

// Sample food data to add
const sampleFoods = [
  {
    name: "Greek Salad",
    description:
      "Food provides essential nutrients for overall health and well-being",
    price: 12,
    category: "Salad",
    image: "food_1.png",
  },
  {
    name: "Veg Salad",
    description:
      "Food provides essential nutrients for overall health and well-being",
    price: 18,
    category: "Salad",
    image: "food_2.png",
  },
  {
    name: "Clover Salad",
    description:
      "Food provides essential nutrients for overall health and well-being",
    price: 16,
    category: "Salad",
    image: "food_3.png",
  },
  {
    name: "Chicken Salad",
    description:
      "Food provides essential nutrients for overall health and well-being",
    price: 24,
    category: "Salad",
    image: "food_4.png",
  },
  {
    name: "Lasagna Rolls",
    description:
      "Food provides essential nutrients for overall health and well-being",
    price: 14,
    category: "Rolls",
    image: "food_5.png",
  },
  {
    name: "Peri Peri Rolls",
    description:
      "Food provides essential nutrients for overall health and well-being",
    price: 12,
    category: "Rolls",
    image: "food_6.png",
  },
  {
    name: "Chicken Rolls",
    description:
      "Food provides essential nutrients for overall health and well-being",
    price: 20,
    category: "Rolls",
    image: "food_7.png",
  },
  {
    name: "Veg Rolls",
    description:
      "Food provides essential nutrients for overall health and well-being",
    price: 15,
    category: "Rolls",
    image: "food_8.png",
  },
  {
    name: "Ripple Ice Cream",
    description:
      "Food provides essential nutrients for overall health and well-being",
    price: 14,
    category: "Deserts",
    image: "food_9.png",
  },
  {
    name: "Fruit Ice Cream",
    description:
      "Food provides essential nutrients for overall health and well-being",
    price: 22,
    category: "Deserts",
    image: "food_10.png",
  },
];

try {
  // Clear existing foods (optional)
  await foodModel.deleteMany({});
  console.log("Cleared existing foods");

  // Insert sample foods
  const result = await foodModel.insertMany(sampleFoods);
  console.log(`✅ Successfully added ${result.length} food items to database!`);
  console.log("\nAdded foods:");
  result.forEach((food) => {
    console.log(`- ${food.name} (LKR ${food.price}) - ${food.category}`);
  });

  console.log("\n🎉 Done! Now you can:");
  console.log("1. View in MongoDB Compass (refresh the foods collection)");
  console.log("2. Open frontend: http://localhost:5176");
  console.log("3. Open admin panel: http://localhost:5175");
} catch (error) {
  console.error("Error adding foods:", error);
} finally {
  await mongoose.connection.close();
  console.log("\nDatabase connection closed");
}
