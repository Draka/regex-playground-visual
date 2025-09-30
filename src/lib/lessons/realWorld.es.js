/**
 * Lección 5: Aplicaciones del Mundo Real
 * Patrones regex útiles para validaciones comunes en desarrollo web
 */

export const realWorldLesson = {
  id: 'real-world',
  title: 'Aplicaciones del Mundo Real',
  difficulty: 'intermediate',
  description: 'Aprende patrones regex útiles para validaciones comunes: emails, URLs, teléfonos, fechas y más.',
  estimatedTime: '15 minutos',
  steps: [
    {
      id: 1,
      title: 'Validación de Email Básica',
      explanation: 'Un patrón simple pero efectivo para validar direcciones de email. Busca: texto + @ + dominio + extensión.',
      pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
      testText: 'Contactos: juan@gmail.com, maria_lopez@empresa.co, admin@sitio-web.org, invalid@.com, @nodominio.com',
      expectedMatches: 3,
      hint: 'Los emails válidos tienen texto antes y después del @, y un dominio con al menos 2 caracteres en la extensión.'
    },
    {
      id: 2,
      title: 'URLs y Sitios Web',
      explanation: 'Detecta URLs completas que empiecen con http:// o https://. Útil para encontrar enlaces en texto.',
      pattern: 'https?://[A-Za-z0-9.-]+\\.[A-Za-z]{2,}(?:/[A-Za-z0-9._~:/?#[\\]@!$&\'()*+,;=-]*)?',
      testText: 'Visita https://google.com o http://ejemplo.org/pagina?id=123. También hay ftp://archivo.com',
      expectedMatches: 2,
      hint: 'El patrón busca http:// o https:// seguido de un dominio válido y opcionalmente una ruta.'
    },
    {
      id: 3,
      title: 'Números de Teléfono',
      explanation: 'Encuentra números de teléfono en diferentes formatos: con o sin códigos de país, con espacios, guiones o paréntesis.',
      pattern: '(?:\\+?\\d{1,3}[\\s.-]?)?(?:\\(?\\d{3}\\)?[\\s.-]?)?\\d{3}[\\s.-]?\\d{4}',
      testText: 'Llama al +52 55 1234-5678, (555) 123-4567, 555.123.4567 o simplemente 5551234567',
      expectedMatches: 4,
      hint: 'El patrón es flexible: código país opcional, área opcional con paréntesis, y números con separadores variables.'
    },
    {
      id: 4,
      title: 'Fechas en Formato DD/MM/YYYY',
      explanation: 'Valida fechas en formato día/mes/año. Acepta separadores como /, - o puntos.',
      pattern: '\\b(?:0?[1-9]|[12]\\d|3[01])[/.-](?:0?[1-9]|1[0-2])[/.-](?:19|20)\\d{2}\\b',
      testText: 'Fechas importantes: 15/03/2024, 01-12-2023, 31.01.2022, 40/15/2024 (inválida), 15/3/24 (año corto)',
      expectedMatches: 3,
      hint: 'Valida días 01-31, meses 01-12, años 1900-2099. La fecha 40/15/2024 es inválida por tener día y mes imposibles.'
    },
    {
      id: 5,
      title: 'Códigos Postales Mexicanos',
      explanation: 'Los códigos postales en México tienen exactamente 5 dígitos. Útil para formularios de direcciones.',
      pattern: '\\b\\d{5}\\b',
      testText: 'Códigos postales: 01234, 54321, 99999, 1234 (muy corto), 123456 (muy largo), CP: 06100',
      expectedMatches: 4,
      hint: 'Exactamente 5 dígitos consecutivos. Los códigos 1234 y 123456 no cumplen el formato.'
    },
    {
      id: 6,
      title: 'Tarjetas de Crédito (Visa)',
      explanation: 'Detecta números de tarjetas Visa que empiezan con 4 y tienen 16 dígitos. Con o sin espacios.',
      pattern: '4\\d{3}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}',
      testText: 'Tarjetas: 4532 1234 5678 9012, 4532-1234-5678-9012, 4532123456789012, 5432123456789012 (MasterCard)',
      expectedMatches: 3,
      hint: 'Visa siempre empieza con 4. MasterCard empieza con 5, por eso no coincide con nuestro patrón.'
    },
    {
      id: 7,
      title: 'Hashtags de Redes Sociales',
      explanation: 'Encuentra hashtags como en Twitter/X: # seguido de letras, números y guiones bajos.',
      pattern: '#[A-Za-z0-9_]+',
      testText: 'Posts populares: #JavaScript #regex_tutorial #HTML5 #CSS3 #2024trends. Símbolo solo: #',
      expectedMatches: 5,
      hint: 'Un hashtag debe tener al menos un carácter después del #. El símbolo # solo no cuenta.'
    },
    {
      id: 8,
      title: 'Direcciones IP v4',
      explanation: 'Valida direcciones IP formato IPv4: 4 números de 0-255 separados por puntos.',
      pattern: '\\b(?:(?:25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)\\b',
      testText: 'IPs: 192.168.1.1, 127.0.0.1, 255.255.255.255, 192.168.300.1 (inválida), 192.168.1',
      expectedMatches: 3,
      hint: 'Cada octeto debe estar entre 0-255. La IP 192.168.300.1 es inválida porque 300 > 255.'
    }
  ]
};