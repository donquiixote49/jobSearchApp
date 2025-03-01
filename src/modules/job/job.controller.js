import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling/asyncHandler.js";
import * as jobService from "./job.service.js";
import isAuthenticated from "../../middlewares/auth.middlewate.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { roles } from "../../DB/models/user.model.js";
import { uploadCloud } from "../../utils/fileUploading/multerCloud.js";
import validation from "../../middlewares/validation.middleware.js";
import * as jobValidation from './job.validation.js'


const router = Router()

router.post(
    "/addJob/:companyId",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    validation(jobValidation.addJob),
    asyncHandler(jobService.addJob)
)

router.patch(
    "/updateJob/:jobId",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    validation(jobValidation.updateJob),
    asyncHandler(jobService.updateJob)
)

router.delete(
    "/deleteJob/:jobId",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    validation(jobValidation.deleteJob),
    asyncHandler(jobService.deleteJob)
)

router.get(
    "/getJobOrJobs/:jobId?/company/:companyId?",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    validation(jobValidation.getJobOrJobsForSpecificCompany),
    asyncHandler(jobService.getJobOrJobsForSpecificCompany)
)
router.get(
    "/getJobsByFilters",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    validation(jobValidation.getJobsByFilters),
    asyncHandler(jobService.getJobsByFilters)
)


router.post(
    "/applyForJob/:jobId",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    uploadCloud().single("pdf"),
    validation(jobValidation.applyForJob),
    asyncHandler(jobService.applyForJob)
)


router.get(
    "/acceptOrRejectApplication/:applicationId",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    validation(jobValidation.acceptOrRejectApplication),
    asyncHandler(jobService.acceptOrReject)
)


router.get(
    "/getExcelFile/:companyId/:date",
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    asyncHandler(jobService.getExcelFile)
)

















export default router