import { Request, Response } from "express";
import { registerUserService, loginUserService } from "../services/authService"

export const registerUser = async (req : Request, res : Response) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'Missing required fields'
            });
        }

        const result = await registerUserService({ name, email, password});

        res.status(201).json({ 
            success: true,
             data: {
                user: result.user,
                token: result.token
             }
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(400).json({ error: 'Failed to register user' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email and password are required' 
        });
      }
      
      const result = await loginUserService({email, password});
      
      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
  };