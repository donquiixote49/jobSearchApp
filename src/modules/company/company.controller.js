import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling/asyncHandler.js";
import * as companyService from "./company.service.js";
import validation from "../../middlewares/validation.middleware.js";
import * as companyValidation from "./company.validation.js";
import isAuthenticated from "../../middlewares/auth.middlewate.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { roles } from "../../DB/models/user.model.js";
import {uploadCloud} from '../../utils/fileUploading/multerCloud.js'
const router = Router();

router.post(
    "/addCompany",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    validation(companyValidation.addCompany),
    asyncHandler(companyService.addCompany)
)

router.get(
    "/addHr/:companyId/:userId",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    validation(companyValidation.addHr),
    asyncHandler(companyService.addHr)
)
router.get(
    "/getCompanyByName",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user || roles.admin),
    validation(companyValidation.getCompanyByName),
    asyncHandler(companyService.getCompanyByName)
)
router.get(
    "/getCompanyJobs/:companyId",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user || roles.admin),
    validation(companyValidation.getCompanyJobs),
    asyncHandler(companyService.getSpecificCompanyJobs)
)


router.patch(
    "/updateCompany/:companyId",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    validation(companyValidation.updateCompany),
    asyncHandler(companyService.updateCompany)
)
router.delete(
    "/softDeleteCompany/:companyId",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user || roles.admin),
    validation(companyValidation.softDeleteCompany),
    asyncHandler(companyService.softDeleteCompany)
)


router.patch(
    "/uploadLogo/:companyId",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    uploadCloud().single("image"),
      validation(companyValidation.uploadLogo),
    asyncHandler(companyService.uploadLogo)
  );
router.patch(
    "/uploadCover/:companyId",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    uploadCloud().single("image"),
      validation(companyValidation.uploadLogo),
    asyncHandler(companyService.uploadCover)
  );


  router.delete(
    "/deleteLogo/:companyId",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    validation(companyValidation.deleteLogo),
    asyncHandler(companyService.deleteLogo)
  );
  router.delete(
    "/deleteCover/:companyId",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    validation(companyValidation.deleteLogo),
    asyncHandler(companyService.deleteCover)
  );
export default router