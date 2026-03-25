# language: es

@password-recovery @critical
Característica: Recuperación de Contraseña
  Como usuario de Patter Hub
  Quiero poder recuperar mi contraseña olvidada
  Para poder acceder nuevamente a mi cuenta

  Antecedentes:
    Dado que el usuario navega a la página de login

  @PT-PASS-001 @smoke
  Escenario: Recuperación exitosa de contraseña
    Dado que el usuario hace clic en "Forgot password?"
    Cuando el usuario ingresa el email de recuperación "dortiz+92@houseedge.ai"
    Y el usuario hace clic en el botón de enviar solicitud
    Entonces el usuario debería recibir un email con el link de recuperación
    Cuando el usuario hace clic en el link de recuperación del email
    Entonces el usuario debería ver la página de restablecer contraseña
    Cuando el usuario ingresa la nueva contraseña "NuevaPrueba12345*"
    Y el usuario confirma la nueva contraseña "NuevaPrueba12345*"
    Y el usuario hace clic en el botón de restablecer contraseña
    Entonces el usuario debería ver un mensaje de éxito