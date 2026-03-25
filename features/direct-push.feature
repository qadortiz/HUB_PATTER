# language: es

@direct-push @admin
Característica: Enviar Direct Push Notification en Patter Hub
  Como admin de Patter Hub
  Quiero enviar notificaciones push directas
  Para comunicarme con los usuarios de forma inmediata

  Antecedentes:
    Dado que el usuario navega a la página de login
    Dado que el usuario tiene credenciales de "admin"
    Cuando el usuario ingresa sus credenciales de admin
    Y el usuario hace clic en el botón de login
    Entonces el usuario debería ser redirigido al dashboard
    Y el dashboard debería estar completamente cargado

  @smoke @PT-PUSH-001
  Escenario: Enviar notificación push directa exitosamente
    Cuando hago clic en el botón "New Direct Push Notification"
    Y ingreso el título de la push "Automated Push Test"
    Y ingreso el mensaje de la push "Automated test message"
    Y hago clic en el botón Send de la push
    Y confirmo la publicación de la push con "Publish now"
    Y espero 5 segundos para confirmar el envío
    Entonces la notificación push directa debería ser enviada exitosamente