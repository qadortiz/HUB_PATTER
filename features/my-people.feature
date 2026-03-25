# language: es
@my-people
Característica: My People - Filter

  @people @admin @smoke @PT-PEOPLE-001
  Escenario: Filtrar miembros por nombre que contenga "patter"
    Dado que el usuario navega a la página de login
    Y el usuario tiene credenciales de "admin"
    Cuando el usuario ingresa sus credenciales de admin
    Y el usuario hace clic en el botón de login
    Entonces el usuario debería ser redirigido al dashboard
    Y el dashboard debería estar completamente cargado
    Cuando el usuario navega a la sección My People
    Y el usuario espera que My People cargue correctamente
    Y el usuario hace clic en el botón Filter
    Y el usuario abre el menú de Properties
    Y el usuario selecciona la propiedad "Name"
    Y el usuario abre el menú de Operator
    Y el usuario selecciona el operador "Contains"
    Y el usuario ingresa el valor de filtro "patter"
    Y el usuario hace clic en View Results
    Entonces la tabla de resultados debería mostrar miembros
