// import { Router } from 'express';
// import jetValidator from 'jet-validator';

// import Paths from '../../constants/Paths';
// import User from '@src/models/User';
// import ContactRoutes from '../contact/contactRoute';


// // **** Variables **** //

// const apiContactRouter = Router(),
//   validate = jetValidator();


// // ** Add contactRouter ** //

// const contactRouter = Router();

// // Get all users
// contactRouter.get(
//   "/",
//   ContactRoutes.getAll,
// );

// // Add one user
// contactRouter.post(
//   Paths.Users.Add,
//   validate(['user', User.isUser]),
//   ContactRoutes.add,
// );

// // Update one user
// contactRouter.put(
//   Paths.Users.Update,
//   validate(['user', User.isUser]),
//   ContactRoutes.update,
// );

// // Delete one user
// contactRouter.delete(
//   Paths.Users.Delete,
//   validate(['id', 'number', 'params']),
//   ContactRoutes.delete,
// );

// // Add contactRouter

// //apiContactRouter.use("/contact", contactRouter);


// // **** Export default **** //

// export default apiContactRouter;
import { Router } from 'express';
//import User from '@src/models/User';
import { ContactRoute} from './contactRoute';
const userCrudRoutes = ContactRoute<any>("");
export default userCrudRoutes;

