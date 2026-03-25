# language: es

@content @admin
Característica: Crear contenido con Push Notification en Patter Hub
  Como admin de Patter Hub
  Quiero crear contenido con notificación push
  Para publicarlo y notificar a los usuarios

  Antecedentes:
    Dado que el usuario navega a la página de login
    Dado que el usuario tiene credenciales de "admin"
    Cuando el usuario ingresa sus credenciales de admin
    Y el usuario hace clic en el botón de login
    Entonces el usuario debería ser redirigido al dashboard
    Y el dashboard debería estar completamente cargado

  @smoke @PT-CONTENT-001
  Escenario: Crear y publicar contenido con push notification
    Cuando navego a la sección de contenido
    Y hago clic en nuevo contenido
    Y ingreso el título del contenido "Automated Content Test"
    Y ingreso la descripción "Description of an automated test for a content push"
    Y agrego una imagen al contenido
    Y selecciono el tipo de contenido "Info"
    Y hago clic en Push Notification
    Y selecciono publicar ahora
    Y selecciono copiar el mismo contenido
    Y guardo la configuración de push
    Y confirmo la publicación con Publish now
    Entonces el contenido con push debería ser publicado exitosamente