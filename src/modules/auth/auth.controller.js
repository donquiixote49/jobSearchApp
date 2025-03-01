import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling/asyncHandler.js";
import * as authService from './auth.service.js'
import validation from "../../middlewares/validation.middleware.js";
import * as authValidation from './auth.validation.js'
const router = Router()


router.post("/register",validation(authValidation.registerValidation),asyncHandler(authService.register))
router.post("/confirmOtp",validation(authValidation.confirmOtp),asyncHandler(authService.confirmEmailOtp))
router.post("/login",validation(authValidation.loginValidation),asyncHandler(authService.loginBySystem))
router.post("/loginWithGmail",validation(authValidation.loginWithGmail),asyncHandler(authService.loginByGmail))
router.post("/forgotPassword",validation(authValidation.forgotPassword),asyncHandler(authService.forgotPassword))
router.post("/resetPassword",validation(authValidation.resetPassword),asyncHandler(authService.resetPassword))
router.post("/newAccess",validation(authValidation.newAccess),asyncHandler(authService.newAccess))

export default router