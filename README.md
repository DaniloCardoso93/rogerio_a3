# rogerio_a3

Instalar as libs
npm i

Rodar a API
npm run dev

Para gerar migration
npm run migration:generate -- src/migrations/CreateTables -d src/data-source.ts

Criar migration
npm run migration:create -- src/migrations/CreateTables

Executar migration
npm run migration:run -- -d src/data-source.ts

Reverter migration
npm run migration:revert -- -d src/data-source.ts
