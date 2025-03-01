import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling/asyncHandler.js";
import * as userService from "./user.service.js";
import validation from "../../middlewares/validation.middleware.js";
import * as userValidation from "./user.validation.js";
import isAuthenticated from "../../middlewares/auth.middlewate.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { roles } from "../../DB/models/user.model.js";
import {uploadCloud} from '../../utils/fileUploading/multerCloud.js'
const router = Router();

router.patch(
  "/updateProfile",
  asyncHandler(isAuthenticated),
  isAuthorized(roles.user),
  validation(userValidation.updateProfile),
  asyncHandler(userService.updateProfile)
);

router.get(
  "/getLoginUser",
  asyncHandler(isAuthenticated),
  isAuthorized(roles.user || roles.admin),
  validation(userValidation.getUserData),
  asyncHandler(userService.getLoginUser)
);

router.get(
  "/getUserData/:userId",
  asyncHandler(isAuthenticated),
  isAuthorized(roles.user || roles.admin),
  asyncHandler(userService.getUserData)
);

router.patch(
    "/updatePassword",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    validation(userValidation.updatePassword),
    asyncHandler(userService.updatePassword)
  );




  


router.patch(
    "/uploadProfilePic",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    uploadCloud().single("image"),
      validation(userValidation.updateProfilePicture),
    asyncHandler(userService.uploadProfilePic)
  );
router.patch(
    "/uploadCoverPic",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    uploadCloud().single("image"),
    validation(userValidation.updateProfilePicture),
    asyncHandler(userService.uploadCoverPic)
  );
router.delete(
    "/deleteProfilePic",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user ),
    asyncHandler(userService.deleteProfilePic)
  );
router.delete(
    "/deleteCoverPic",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    asyncHandler(userService.deleteCoverPic)
  );
router.delete(
    "/deleteAccount",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user || roles.admin ),
    asyncHandler(userService.deactivateAccount)
  );

export default router;
