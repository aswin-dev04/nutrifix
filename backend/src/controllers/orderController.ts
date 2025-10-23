import { Request, Response } from "express";
import prisma from '../config/database';

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { mealId, quantity, deliveryAddress }  = req.body;
        const userId = req.user?.userId;
        
        if(!mealId || !quantity || !deliveryAddress) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }

        const meal = await prisma.meal.findUnique({ where: { id: mealId } });
        if (!meal) {
            return res.status(404).json({ success: false, error: "Meal not found" });
        }

        const totalPrice = meal.price * quantity;

        const order = await prisma.order.create({
            data: {
              userId,
              mealId,
              vendorId: meal.vendorId, 
              quantity,
              deliveryAddress,
              totalPrice,
              status: "pending",
            },
        });
      
        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order,
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to create order" });
    }
};

export const getUserSingleOrder = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        const userId = req.user?.userId;
    
        const order = await prisma.order.findFirst({
            where: { id: orderId, userId },
            include: { meal: true, vendor: true },
        });
    
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.status(200).json({ order });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  };
  
export const getUserAllOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;

        const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { orderedAt: "desc" },
        include: { meal: true, vendor: true },
        });

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

export const cancelOrder = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        const userId = req.user?.userId;
    
        if (!orderId) return res.status(400).json({ error: "Order ID is required" });
    
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order || order.userId !== userId) {
            return res.status(404).json({ error: "Order not found or not yours" });
        }
    
        if (!["pending", "confirmed"].includes(order.status)) {
            return res.status(400).json({ error: `Cannot cancel order with status: ${order.status}` });
        }
    
        const cancelledOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: "cancelled" },
        });
  
      res.status(200).json({ message: "Order cancelled successfully", order: cancelledOrder });
    } catch (error) {
        res.status(500).json({ error: "Failed to cancel order" });
    }
};
  
  