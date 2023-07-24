export const roles = {
  admin: 'admin',
  user: 'user',
  guest: 'guest'
};

export const environment  = {
  development: 'dev',
  production: 'prd'  
};

export const cookiesTime = {
  jwt: 24 * 60 * 60 * 1000, // 1 día en milisegundos
  RestorePass: 60 * 60 * 1000 // 1 hora
}