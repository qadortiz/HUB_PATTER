# language: es
@my-organization
Característica: My Organization - Cards

  @organization @admin @smoke @PT-ORG_CARDS-001
  Escenario: Crear nueva card con imagen y componente de texto
    Dado que el usuario navega a la página de login
    Y el usuario tiene credenciales de "admin"
    Cuando el usuario ingresa sus credenciales de admin
    Y el usuario hace clic en el botón de login
    Entonces el usuario debería ser redirigido al dashboard
    Y el dashboard debería estar completamente cargado
    Cuando el usuario navega a la sección My Organization
    Y el usuario hace scroll hasta el botón Add Card y hace clic
    Y el usuario ingresa el título de la card "Card Automation HE"
    Y el usuario hace clic en Upload Image
    Y el usuario sube la imagen desde el sistema de archivos
    Y el usuario hace clic en Finish Crop
    Y el usuario hace clic en Save imagen
    Y el usuario espera que la imagen se guarde
    Y el usuario hace clic en New Component
    Y el usuario selecciona Custom Text
    Y el usuario hace clic en Add Component
    Y el usuario expande el componente Custom Text
    Y el usuario ingresa el título del componente "TEST"
    Y el usuario ingresa el texto del componente "TEST"
    Y el usuario hace clic en Save
    Entonces debería aparecer el modal de éxito "Organization updated successfully"