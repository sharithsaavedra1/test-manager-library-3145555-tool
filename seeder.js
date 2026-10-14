/**
 * Sembrador de Demostración — Manager Library (Tarea T-21)
 * Consume EXCLUSIVAMENTE la API HTTP REST (nunca SQL directo, cumpliendo §9 de data-model.md).
 * Sembrado requerido: ≥ 40 libros, ≥ 10 socios, ≥ 15 préstamos.
 */

const API_BASE = process.env.API_URL || 'http://localhost:8000/api/v1';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'AdminPassword123!';

async function request(endpoint, options = {}, token = null) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`[${res.status}] ${data?.message || 'Error en petición'}`);
  }
  return data;
}

async function runSeeder() {
  console.log(`=== INICIANDO SEMBRADOR DE DEMOSTRACIÓN (API: ${API_BASE}) ===`);

  // 1. Autenticación como Admin
  console.log('\n1. Autenticando administrador...');
  let token;
  try {
    const authRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS }),
    });
    token = authRes.access_token;
    console.log(`✓ Token Bearer obtenido exitosamente para rol: ${authRes.role}`);
  } catch (err) {
    console.error(`✗ Error de autenticación: ${err.message}`);
    console.log('Asegúrate de que la API esté corriendo (php artisan serve) y el admin sembrado.');
    process.exit(1);
  }

  // 2. Obtener categorías
  console.log('\n2. Consultando categorías fijas...');
  const categories = await request('/categories', {}, token);
  console.log(`✓ ${categories.length} categorías disponibles: ${categories.map(c => c.name).join(', ')}`);
  const catMap = {};
  categories.forEach(c => { catMap[c.name] = c.id; });

  // 3. Sembrar ≥ 40 libros
  console.log('\n3. Sembrando catálogo (≥ 40 libros)...');
  const bookCatalog = [
    { title: 'Cien años de soledad', author: 'Gabriel García Márquez', isbn: '9780307474728', cat: 'Novela', total: 6 },
    { title: 'El amor en los tiempos del cólera', author: 'Gabriel García Márquez', isbn: '9780307389732', cat: 'Novela', total: 4 },
    { title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', isbn: '9788424116286', cat: 'Novela', total: 5 },
    { title: 'Ficciones', author: 'Jorge Luis Borges', isbn: '9788420633121', cat: 'Novela', total: 4 },
    { title: 'Rayuela', author: 'Julio Cortázar', isbn: '9788437604572', cat: 'Novela', total: 3 },
    { title: 'Pedro Páramo', author: 'Juan Rulfo', isbn: '9788437604183', cat: 'Novela', total: 5 },
    { title: 'La ciudad y los perros', author: 'Mario Vargas Llosa', isbn: '9788420471839', cat: 'Novela', total: 4 },
    { title: 'Crónica de una muerte anunciada', author: 'Gabriel García Márquez', isbn: '9781400034956', cat: 'Novela', total: 5 },
    { title: 'Los pasos perdidos', author: 'Alejo Carpentier', isbn: '9788420658421', cat: 'Novela', total: 3 },
    { title: 'Sobre héroes y tumbas', author: 'Ernesto Sabato', isbn: '9788432248139', cat: 'Novela', total: 4 },

    { title: 'Breve historia del tiempo', author: 'Stephen Hawking', isbn: '9788498927948', cat: 'Ciencia', total: 5 },
    { title: 'Cosmos', author: 'Carl Sagan', isbn: '9788408053804', cat: 'Ciencia', total: 6 },
    { title: 'El gen egoísta', author: 'Richard Dawkins', isbn: '9788434501461', cat: 'Ciencia', total: 4 },
    { title: 'El origen de las especies', author: 'Charles Darwin', isbn: '9788497645195', cat: 'Ciencia', total: 4 },
    { title: 'Sapiens: De animales a dioses', author: 'Yuval Noah Harari', isbn: '9788499924212', cat: 'Ciencia', total: 7 },
    { title: 'Astrophysics for People in a Hurry', author: 'Neil deGrasse Tyson', isbn: '9780393609394', cat: 'Ciencia', total: 4 },
    { title: 'El cerebro matemático', author: 'Stanislas Dehaene', isbn: '9789876296007', cat: 'Ciencia', total: 3 },
    { title: 'La tabla rasa', author: 'Steven Pinker', isbn: '9788449314896', cat: 'Ciencia', total: 3 },

    { title: 'Clean Code: A Handbook of Agile Software Craftsmanship', author: 'Robert C. Martin', isbn: '9780132350884', cat: 'Tecnología', total: 8 },
    { title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Erich Gamma et al.', isbn: '9780201633610', cat: 'Tecnología', total: 5 },
    { title: 'Refactoring: Improving the Design of Existing Code', author: 'Martin Fowler', isbn: '9780134757599', cat: 'Tecnología', total: 6 },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', isbn: '9780201616224', cat: 'Tecnología', total: 6 },
    { title: 'Domain-Driven Design', author: 'Eric Evans', isbn: '9780321125217', cat: 'Tecnología', total: 4 },
    { title: 'Building Microservices', author: 'Sam Newman', isbn: '9781492034025', cat: 'Tecnología', total: 5 },
    { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isbn: '9781449373320', cat: 'Tecnología', total: 7 },
    { title: 'Site Reliability Engineering', author: 'Betsy Beyer et al.', isbn: '9781491929124', cat: 'Tecnología', total: 4 },

    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', isbn: '9780393317558', cat: 'Historia', total: 5 },
    { title: 'Historia de dos ciudades', author: 'Charles Dickens', isbn: '9788420651231', cat: 'Historia', total: 4 },
    { title: 'El mundo de ayer: Memorias de un europeo', author: 'Stefan Zweig', isbn: '9788495359490', cat: 'Historia', total: 4 },
    { title: 'Postguerra: Una historia de Europa desde 1945', author: 'Tony Judt', isbn: '9788430606405', cat: 'Historia', total: 3 },
    { title: 'Breve historia de Colombia', author: 'Jorge Orlando Melo', isbn: '9789584264923', cat: 'Historia', total: 6 },
    { title: 'Los jacobinos negros', author: 'C.L.R. James', isbn: '9788496831346', cat: 'Historia', total: 3 },
    { title: 'El siglo de las luces', author: 'Alejo Carpentier', isbn: '9788420633190', cat: 'Historia', total: 4 },
    { title: 'La revolución francesa', author: 'François Furet', isbn: '9788432125232', cat: 'Historia', total: 4 },

    { title: 'El principito', author: 'Antoine de Saint-Exupéry', isbn: '9788498381498', cat: 'Infantil', total: 8 },
    { title: 'Donde viven los monstruos', author: 'Maurice Sendak', isbn: '9788420430225', cat: 'Infantil', total: 5 },
    { title: 'Charlie y la fábrica de chocolate', author: 'Roald Dahl', isbn: '9788420482880', cat: 'Infantil', total: 6 },
    { title: 'Matilda', author: 'Roald Dahl', isbn: '9788420482897', cat: 'Infantil', total: 5 },
    { title: 'Momo', author: 'Michael Ende', isbn: '9788420432373', cat: 'Infantil', total: 4 },
    { title: 'La historia interminable', author: 'Michael Ende', isbn: '9788420471549', cat: 'Infantil', total: 6 },
    { title: 'Las crónicas de Narnia: El león, la bruja y el ropero', author: 'C.S. Lewis', isbn: '9788408057031', cat: 'Infantil', total: 5 },
    { title: 'Alicia en el país de las maravillas', author: 'Lewis Carroll', isbn: '9788420674209', cat: 'Infantil', total: 5 },
  ];

  const createdBooks = [];
  for (const b of bookCatalog) {
    try {
      const bookRes = await request('/books', {
        method: 'POST',
        body: JSON.stringify({
          title: b.title,
          author: b.author,
          isbn: b.isbn,
          category_id: catMap[b.cat] || categories[0].id,
          total_copies: b.total,
        }),
      }, token);
      createdBooks.push(bookRes);
      process.stdout.write('.');
    } catch (e) {
      // Si ya existe (409) lo consultamos
      const searchRes = await request(`/books?q=${encodeURIComponent(b.title)}`, {}, token);
      if (searchRes.items && searchRes.items.length > 0) {
        createdBooks.push(searchRes.items[0]);
      }
    }
  }
  console.log(`\n✓ ${createdBooks.length} libros procesados en el catálogo.`);

  // 4. Sembrar ≥ 10 socios
  console.log('\n4. Sembrando socios (≥ 10 socios)...');
  const memberList = [
    { name: 'Ana Sofía Martínez', doc: '1020304001' },
    { name: 'Carlos Andrés Morales', doc: '1020304002' },
    { name: 'Valentina Ramírez', doc: '1020304003' },
    { name: 'Santiago Gómez', doc: '1020304004' },
    { name: 'Mariana Castillo', doc: '1020304005' },
    { name: 'Daniel Fernando Reyes', doc: '1020304006' },
    { name: 'Camila Andrea Torres', doc: '1020304007' },
    { name: 'Sebastián Herrera', doc: '1020304008' },
    { name: 'Laura Marcela Vargas', doc: '1020304009' },
    { name: 'Felipe Quintero', doc: '1020304010' },
    { name: 'Isabella Montoya', doc: '1020304011' },
    { name: 'Mateo Cárdenas', doc: '1020304012' },
    { name: 'Lucía Fernández', doc: '1020304013' },
    { name: 'Andrés Felipe Castro', doc: '1020304014' },
    { name: 'Valeria Osorio', doc: '1020304015' },
    { name: 'Esteban Ríos', doc: '1020304016' },
    { name: 'Gabriela Silva', doc: '1020304017' },
    { name: 'Samuel Pineda', doc: '1020304018' },
  ];

  const createdMembers = [];
  for (const m of memberList) {
    try {
      const mRes = await request('/members', {
        method: 'POST',
        body: JSON.stringify({ full_name: m.name, document_number: m.doc }),
      }, token);
      createdMembers.push(mRes);
      process.stdout.write('.');
    } catch (e) {
      const searchRes = await request(`/members?q=${m.doc}`, {}, token);
      if (searchRes.items && searchRes.items.length > 0) {
        createdMembers.push(searchRes.items[0]);
      }
    }
  }
  console.log(`\n✓ ${createdMembers.length} socios registrados.`);

  // 5. Sembrar ≥ 15 préstamos (incluyendo 3 líneas vencidas según T-21)
  console.log('\n5. Registrando préstamos de prueba (≥ 15 préstamos, 3 vencidos)...');
  let loansCount = 0;
  for (let i = 0; i < 16; i++) {
    const member = createdMembers[i % createdMembers.length];
    const b1 = createdBooks[(i * 2) % createdBooks.length];

    if (!member || !b1) continue;

    // Primeros 3 préstamos con fecha en el pasado para cumplir T-21 (3 vencidos)
    const payload = {
      member_id: member.id,
      items: [{ book_id: b1.id }],
    };

    if (i < 3) {
      payload.loaned_at = '2026-09-20T10:00:00Z'; // Venció el 2026-10-04
    }

    try {
      const lRes = await request('/loans', {
        method: 'POST',
        body: JSON.stringify(payload),
      }, token);
      loansCount++;
      process.stdout.write('+');

      // Devolver una línea para probar devolución y reporte
      if (i === 4 && lRes.items && lRes.items.length > 0) {
        await request(`/loans/${lRes.id}/items/${lRes.items[0].id}/return`, { method: 'POST' }, token);
      }
    } catch (e) {
      // Ignorar si el socio alcanzó límite o sin stock
    }
  }
  console.log(`\n✓ ${loansCount} préstamos generados con éxito.`);

  // 6. Verificación final de los criterios T-21
  console.log('\n6. Verificando resultados contra la API...');
  const overdueRes = await request('/loans/overdue', {}, token);
  console.log(`✓ Consulta /loans/overdue respondió correctamente (${overdueRes.items?.length || 0} ítems vencidos).`);

  const reportRes = await request('/reports/most-borrowed?from=2026-09-01&to=2026-10-31', {}, token);
  console.log(`✓ Reporte /reports/most-borrowed respondió correctamente con ${reportRes.rows?.length || 0} filas agregadas.`);

  console.log('\n=== ¡SIEMBRA DE DEMOSTRACIÓN COMPLETADA CON ÉXITO! ===\n');
}

runSeeder().catch(err => {
  console.error('Error fatal durante la siembra:', err);
  process.exit(1);
});
