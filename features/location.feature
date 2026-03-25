# language: es
@location
Característica: Location - Create Location

  @location @admin @smoke @PT-LOCATION-001
  Escenario: Crear una nueva location con imagen y dirección
    Dado que el usuario navega a la página de login
    Y el usuario tiene credenciales de "admin"
    Cuando el usuario ingresa sus credenciales de admin
    Y el usuario hace clic en el botón de login
    Entonces el usuario debería ser redirigido al dashboard
    Y el dashboard debería estar completamente cargado
    Cuando el usuario navega a la sección Location
    Y el usuario hace clic en New Location
    Y el usuario hace clic en Add an Image or video
    Y el usuario hace clic en Browse Images
    Y el usuario espera que la librería cargue
    Y el usuario selecciona la primera imagen de la librería
    Y el usuario hace clic en Save imagen de location
    Y el usuario ingresa el nombre de la location "New Location HE Auto"
    Y el usuario ingresa la dirección "bogota"
    Y el usuario selecciona la primera sugerencia de dirección
    Y el usuario ingresa la descripción de la location "this a test automation by houseedge"
    Y el usuario hace clic en Publish location
    Entonces debería aparecer el modal de éxito de location