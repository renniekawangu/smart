import { Request, Response } from 'express';
import { userService } from '../services/index';
import { hashPassword, comparePasswords } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { successResponse, errorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const authController = {
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json(errorResponse('Missing required fields'));
        return;
      }

      const existingUser = await userService.getUserByEmail(email);
      if (existingUser) {
        res.status(409).json(errorResponse('User already exists'));
        return;
      }

      const passwordHash = await hashPassword(password);
      const user = await userService.createUser(name, email, passwordHash);
      const token = generateToken(user.id, user.role || 'client');

      res.status(201).json(
        successResponse({
          user: { id: user.id, name: user.name, email: user.email, role: user.role },
          token,
        })
      );
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },

  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json(errorResponse('Missing email or password'));
        return;
      }

      const user = await userService.getUserByEmail(email);
      if (!user) {
        res.status(401).json(errorResponse('Invalid credentials'));
        return;
      }

      const isPasswordValid = await comparePasswords(password, user.passwordHash);
      if (!isPasswordValid) {
        res.status(401).json(errorResponse('Invalid credentials'));
        return;
      }

      const token = generateToken(user.id, user.role || 'client');
      res.json(
        successResponse({
          user: { id: user.id, name: user.name, email: user.email, role: user.role },
          token,
        })
      );
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },

  getCurrentUser: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json(errorResponse('Not authenticated'));
        return;
      }

      const user = await userService.getUserById(req.userId);
      if (!user) {
        res.status(404).json(errorResponse('User not found'));
        return;
      }

      res.json(
        successResponse({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          preferences: user.preferences,
        })
      );
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },

  updateUser: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;

      if (req.userId !== userId) {
        res.status(403).json(errorResponse('Forbidden'));
        return;
      }

      const { name, preferences } = req.body;
      const user = await userService.updateUser(userId, { name, preferences });

      if (!user) {
        res.status(404).json(errorResponse('User not found'));
        return;
      }

      res.json(
        successResponse({
          id: user.id,
          name: user.name,
          email: user.email,
          preferences: user.preferences,
        })
      );
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },
};
