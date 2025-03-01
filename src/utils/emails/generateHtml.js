export const confirmEmail = (otp)=>  `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification Form</title>
  <style>
    .form-container {
      max-width: 400px;
      margin: 40px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      
      
      

    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-control {
      width: 100%;
      height: 40px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    .form-error {
      color: #f00;
      font-size: 12px;
      margin-top: 5px;
    }

    .form-footer {
      margin-top: 20px;
      text-align: center;
    }

    .btn {
      width: 100%;
      height: 40px;
      padding: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      text-align:center;
      
      
      
      
    }

    .btn-primary {
      background-color: #4CAF50;
      color: #fff;
    }

    .btn-secondary {
      background-color: #ccc;
      color: #333;
    }
  </style>
</head>

<body>
  <div class="form-container">
    <h2>Confirm Your Email</h2>
    <p>Please use this otp to confirm your email </p>
    <h3>${otp}</h3>
    <h3><strong>this otp is only valid for 10 mins </strong></h3>
  </div>
</body>

</html>
`





export const forgotPassword = (otp)=>  `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification Form</title>
  <style>
    .form-container {
      max-width: 400px;
      margin: 40px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      
      
      

    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-control {
      width: 100%;
      height: 40px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    .form-error {
      color: #f00;
      font-size: 12px;
      margin-top: 5px;
    }

    .form-footer {
      margin-top: 20px;
      text-align: center;
    }

    .btn {
      width: 100%;
      height: 40px;
      padding: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      text-align:center;
      
      
      
      
    }

    .btn-primary {
      background-color: #4CAF50;
      color: #fff;
    }

    .btn-secondary {
      background-color: #ccc;
      color: #333;
    }
  </style>
</head>

<body>
  <div class="form-container">
    <h2>Reset Your Password</h2>
    <p>Please use this otp to reset ur Password </p>
    <h3>${otp}</h3>
    <h3><strong>this otp is only valid for 10 mins </strong></h3>
  </div>
</body>

</html>
`





export const accepted = ()=>  `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification Form</title>
  <style>
    .form-container {
      max-width: 400px;
      margin: 40px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      
      
      

    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-control {
      width: 100%;
      height: 40px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    .form-error {
      color: #f00;
      font-size: 12px;
      margin-top: 5px;
    }

    .form-footer {
      margin-top: 20px;
      text-align: center;
    }

    .btn {
      width: 100%;
      height: 40px;
      padding: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      text-align:center;
      
      
      
      
    }

    .btn-primary {
      background-color: #4CAF50;
      color: #fff;
    }

    .btn-secondary {
      background-color: #ccc;
      color: #333;
    }
  </style>
</head>

<body>
  <div class="form-container">
    <h2>congratulations you got accept for the position you applied for </h2>
  </div>
</body>

</html>
`
export const rejected = ()=>  `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification Form</title>
  <style>
    .form-container {
      max-width: 400px;
      margin: 40px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      
      
      

    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-control {
      width: 100%;
      height: 40px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    .form-error {
      color: #f00;
      font-size: 12px;
      margin-top: 5px;
    }

    .form-footer {
      margin-top: 20px;
      text-align: center;
    }

    .btn {
      width: 100%;
      height: 40px;
      padding: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      text-align:center;
      
      
      
      
    }

    .btn-primary {
      background-color: #4CAF50;
      color: #fff;
    }

    .btn-secondary {
      background-color: #ccc;
      color: #333;
    }
  </style>
</head>

<body>
  <div class="form-container">
    <h2>we are sorry to inform you that you got rejected for the position you applied for  </h2>
  </div>
</body>

</html>
`