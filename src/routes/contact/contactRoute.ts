import { ContactService } from '@src/services/index';
import { Router, Request, Response } from 'express';
import jetValidator from 'jet-validator';

const validate = jetValidator();

export function ContactRoute<T>(model?: any): Router {
  const router = Router();

  // Get all items
  router.post(
    '/',
    async (req: Request, res: Response) => {
    //  res.send(`Get all ${model.collectionName}`);
    const users = await ContactService.handleGetAllContactsAddByUser(req,res);
 
    return users;
    }
  );

  // // Get one item
  // router.get(
  //   '/:id',
  //   (req: Request, res: Response) => {
  //     // Your logic for getting one item by ID
  //     res.send(`Get ${model.collectionName} by ID: ${req.params.id}`);
  //   }
  // );

  // // Add item
  router.post(
    '/add',
    async (req: Request, res: Response) => {
      const usersAdd = await ContactService.handleContactAdd(req,res);
      console.log("%c ❤️: usersAdd ", "font-size:16px;background-color:#ec73f4;color:white;", usersAdd)
      return usersAdd;
    }
  );

  // // Update item
  // router.put(
  //   '/:id',
  //   validate(['item', model]),
  //   (req: Request, res: Response) => {
  //     // Your logic for updating an item by ID
  //     res.send(`Update ${model.collectionName} by ID: ${req.params.id}`);
  //   }
  // );
    // // Add item
    router.put(
      '/edit',
      async (req: Request, res: Response) => {
        const usersEdit = await ContactService.handleContactEdit(req,res);
        console.log("%c ❤️: usersEdit", "font-size:16px;background-color:#ec73f4;color:white;", usersEdit)
        return usersEdit;
      }
    );

    router.post(
      '/delete',
      async (req: Request, res: Response) => {
        const usersDelete = await ContactService.handleContactDelete(req,res);
        return usersDelete;
      }
    );

  // // Delete item
  // router.delete(
  //   '/:id',
  //   validate(['id', 'number', 'params']),
  //   (req: Request, res: Response) => {
  //     // Your logic for deleting an item by ID
  //     res.send(`Delete ${model.collectionName} by ID: ${req.params.id}`);
  //   }
  // );

  router.post(
    '/search',
    async (req: Request, res: Response) => {
      const userSearch = await ContactService.handleContactSearch(req,res);
      console.log("%c 🇬🇧: userSearch ", "font-size:16px;background-color:#cd1f01;color:white;", userSearch)
      return userSearch;
    }
  );

  return router;
}
