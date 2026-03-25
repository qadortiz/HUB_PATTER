# language: es
@login @critical
Característica: Autenticación en Patter Hub
  Como usuario del sistema Patter Hub
  Quiero poder autenticarme con mis credenciales
  Para acceder a las funcionalidades de la plataforma

  Antecedentes:
    Dado que el usuario navega a la página de login

  @smoke @admin @PT-LOGIN-001
  Escenario: Login exitoso como Admin
    Dado que el usuario tiene credenciales de "admin"
    Cuando el usuario ingresa sus credenciales de admin
    Y el usuario hace clic en el botón de login
    Entonces el usuario debería ser redirigido al dashboard
    Y el dashboard debería estar completamente cargado

  @smoke @superadmin @otp @PT-LOGIN-002
  Escenario: Login exitoso como Super Admin con OTP
    Dado que el usuario tiene credenciales de "superadmin"
    Cuando el usuario ingresa sus credenciales de superadmin
    Y el usuario hace clic en el botón de login
    Entonces el usuario debería ver la página de verificación OTP
    Cuando el usuario ingresa el código OTP válido
    Y el usuario envía el código OTP
    Entonces el usuario debería ser redirigido al dashboard
    Y el dashboard debería estar completamente cargado

  @admin @negative @PT-LOGIN-003
  Escenario: Login fallido con credenciales inválidas de Admin
    Dado que el usuario está en la página de login
    Cuando el usuario ingresa el email "admin@invalid.com"
    Y el usuario ingresa la contraseña "WrongPassword123"
    Y el usuario hace clic en el botón de login
    Entonces el usuario debería ver un mensaje de error
    Y el usuario no debería estar autenticado

  @admin @PT-LOGIN-004
  Escenario: Login con función "Remember me"
    Dado que el usuario tiene credenciales de "admin"
    Cuando el usuario ingresa sus credenciales de admin
    Y el usuario marca la opción "Remember me on this device"
    Y el usuario hace clic en el botón de login
    Entonces el usuario debería ser redirigido al dashboard
    Y la sesión debería estar marcada como "recordada"

  @admin @ui @PT-LOGIN-005
  Escenario: Visualización de contraseña
    Dado que el usuario está en la página de login
    Cuando el usuario ingresa la contraseña "Test123!"
    Entonces la contraseña debería estar oculta por defecto
    Cuando el usuario hace clic en el botón de mostrar contraseña
    Entonces la contraseña debería ser visible

  @admin @PT-LOGIN-006
  Escenario: Navegación a recuperación de contraseña
    Dado que el usuario está en la página de login
    Cuando el usuario hace clic en "Forgot password?"
    Entonces el usuario debería ser redirigido a la página de recuperación de contraseña

  @superadmin @otp @negative @PT-LOGIN-007
  Escenario: Login fallido con OTP inválido
    Dado que el usuario tiene credenciales de "superadmin"
    Cuando el usuario ingresa sus credenciales de superadmin
    Y el usuario hace clic en el botón de login
    Y el usuario debería ver la página de verificación OTP
    Cuando el usuario ingresa el código OTP "0000"
    Y el usuario envía el código OTP
    Entonces el usuario debería ver un mensaje de error de OTP inválido
    Y el usuario no debería estar autenticado

  @superadmin @otp @PT-LOGIN-008 @pending
  Escenario: Reenvío de código OTP
    Dado que el usuario tiene credenciales de "superadmin"
    Cuando el usuario ingresa sus credenciales de superadmin
    Y el usuario hace clic en el botón de login
    Y el usuario debería ver la página de verificación OTP
    Cuando el usuario hace clic en "Resend code"
    Entonces el usuario debería recibir un nuevo código OTP
    Y el usuario debería poder ingresar el nuevo código OTP

  @admin @superadmin @PT-LOGIN-009
  Escenario: Campos requeridos de formulario de login
    Dado que el usuario está en la página de login
    Cuando el usuario hace clic en el botón de login sin ingresar datos
    Entonces el campo de email debería mostrar error de campo requerido
    Y el campo de contraseña debería mostrar error de campo requerido

  @admin @validation @PT-LOGIN-010
  Escenario: Validación de formato de email
    Dado que el usuario está en la página de login
    Cuando el usuario ingresa el email "invalid-email-format"
    Y el usuario hace clic en el botón de login
    Entonces el usuario debería ver un mensaje de formato de email inválido
