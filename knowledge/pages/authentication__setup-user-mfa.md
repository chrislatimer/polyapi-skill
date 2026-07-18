Source: https://docs.polyapi.io/authentication/setup-user-mfa.html

# Setting up MFA for your User Account

PolyAPI supports Multi-Factor Authentication (MFA) for added security.

Warning

You must have MFA enabled for your tenant before you can setup MFA for individual users.

If you are setting up a new tenant, please check out these docs for how to enable MFA for your tenant:

[Enable MFA for Your Tenant](enable-mfa-tenant.html)

## Setup MFA for your Account

To setup MFA for your account, please hit the following endpoint:

```
POST /otp/setup
```

You should receive back a QR code. Please scan the QR code with your Authenticator app of choice!

(Note: you can also receive your pairing link as text (instead of QR code) via the `/otp/pair` endpoint. This is usually used with desktop authenticator apps.)

## Verify MFA for your Account

Before you can use MFA, you must verify it. To do so, please hit the following endpoint:

```
POST /otp/verify
{"token": "123456"}
```

If you have provided a valid token, you should receive back a 200 response.

Great! You are setup and ready to go with MFA! Now let’s use it.

## Use MFA for your Account

To use MFA on an endpoint that requires it, please add your OTP via the following header:

```
x-otp: 123456
```

For example, on the create users endpoint for tenant 123, the request would look like this:

[![Create User with OTP](../_images/create-user.png)](../_images/create-user.png)

## Victory

That’s it!

You are now setup with MFA, providing additional security to your PolyAPI account.

## Reset MFA

If at any point, you want to reset your MFA please have an admin hit the following endpoint:

```
POST /tenants/123/users/456/reset-mfa
```

This will reset MFA for user 456 in tenant 123.

The common use case for this is if a user gets a new MFA device, like a new phone.

User 456 can then to go back to the `Setup` flow and go through MFA setup again on a new device.

Note

If you are a super admin managing your own instance and want to reset MFA, please contact [support@polyapi.io](mailto:support%40polyapi.io) for assistance.

Additional verification is required for super admin users.
