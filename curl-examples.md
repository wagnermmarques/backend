# Comandos curl para API Música

**Base URL:** `http://localhost:3001/api`

Use `Authorization: Bearer <ADMIN_TOKEN>` para rotas admin e `Authorization: Bearer <USER_TOKEN>` para rotas autenticadas de usuário.

## Artistas

```bash
# 1 - Criar artista (admin)
curl -X POST http://localhost:3001/api/artistas -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"nome":"Artista Teste","bio":"Bio curta","genero":"Rock"}'

# 2 - Criar artista (sem token) -> deve falhar
curl -X POST http://localhost:3001/api/artistas -H "Content-Type: application/json" -d '{"nome":"Artista Sem Token","bio":"Teste"}'

# 3 - Criar artista com campo faltando -> validação
curl -X POST http://localhost:3001/api/artistas -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"bio":"Sem nome"}'

# 4 - Listar artistas
curl -X GET http://localhost:3001/api/artistas -H "Accept: application/json"

# 5 - Obter artista por ID
curl -X GET http://localhost:3001/api/artistas/<ARTISTA_ID> -H "Accept: application/json"

# 6 - Atualizar artista (admin)
curl -X PUT http://localhost:3001/api/artistas/<ARTISTA_ID> -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"nome":"Artista Atualizado","bio":"Bio nova"}'

# 7 - Atualizar artista sem admin -> deve falhar
curl -X PUT http://localhost:3001/api/artistas/<ARTISTA_ID> -H "Content-Type: application/json" -H "Authorization: Bearer <USER_TOKEN>" -d '{"nome":"Tentativa Não Autorizada"}'

# 8 - Atualizar somente bio
curl -X PUT http://localhost:3001/api/artistas/<ARTISTA_ID> -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"bio":"Nova biografia"}'

# 9 - Deletar artista (admin)
curl -X DELETE http://localhost:3001/api/artistas/<ARTISTA_ID> -H "Authorization: Bearer <ADMIN_TOKEN>"

# 10 - Deletar artista (não-admin) -> deve falhar
curl -X DELETE http://localhost:3001/api/artistas/<ARTISTA_ID> -H "Authorization: Bearer <USER_TOKEN>"

# 11 - Buscar por query (se suportado)
curl -X GET "http://localhost:3001/api/artistas?q=Artista" -H "Accept: application/json"

# 12 - Listar com paginação (se suportado)
curl -X GET "http://localhost:3001/api/artistas?page=2&limit=10" -H "Accept: application/json"

# 13 - Criar artista com campo extra
curl -X POST http://localhost:3001/api/artistas -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"nome":"ComExtra","bio":"Tem extra","extra":"valor"}'

# 14 - Criar artistas em sequência (bulk)
curl -X POST http://localhost:3001/api/artistas -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"nome":"Bulk Artista 1"}'
curl -X POST http://localhost:3001/api/artistas -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"nome":"Bulk Artista 2"}'

# 15 - Obter artista inválido -> erro
curl -X GET http://localhost:3001/api/artistas/000000000000000000000000 -H "Accept: application/json"
```

## Álbuns

```bash
# 1 - Criar álbum (admin)
curl -X POST http://localhost:3001/api/albuns -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"titulo":"Álbum Teste","artistaId":"<ARTISTA_ID>","data":"2026","generos":["Rock"],"gravadora":"Independente"}'

# 2 - Criar álbum sem admin -> deve falhar
curl -X POST http://localhost:3001/api/albuns -H "Content-Type: application/json" -d '{"titulo":"Album Não Autorizado","artistaId":"<ARTISTA_ID>"}'

# 3 - Criar álbum sem artistaId -> validação
curl -X POST http://localhost:3001/api/albuns -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"titulo":"Sem Artista"}'

# 4 - Listar álbuns
curl -X GET http://localhost:3001/api/albuns -H "Accept: application/json"

# 5 - Obter álbum por ID
curl -X GET http://localhost:3001/api/albuns/<ALBUM_ID> -H "Accept: application/json"

# 6 - Atualizar álbum (admin)
curl -X PUT http://localhost:3001/api/albuns/<ALBUM_ID> -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"titulo":"Álbum Atualizado","gravadora":"NovaProd"}'

# 7 - Atualizar álbum sem admin -> deve falhar
curl -X PUT http://localhost:3001/api/albuns/<ALBUM_ID> -H "Content-Type: application/json" -H "Authorization: Bearer <USER_TOKEN>" -d '{"titulo":"Tentativa"}'

# 8 - Atualizar somente gravadora
curl -X PUT http://localhost:3001/api/albuns/<ALBUM_ID> -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"gravadora":"Nova Gravadora"}'

# 9 - Deletar álbum (admin)
curl -X DELETE http://localhost:3001/api/albuns/<ALBUM_ID> -H "Authorization: Bearer <ADMIN_TOKEN>"

# 10 - Deletar álbum sem admin -> deve falhar
curl -X DELETE http://localhost:3001/api/albuns/<ALBUM_ID> -H "Authorization: Bearer <USER_TOKEN>"

# 11 - Listar álbuns por artista
curl -X GET "http://localhost:3001/api/albuns?artistaId=<ARTISTA_ID>" -H "Accept: application/json"

# 12 - Upload cover simulado (se suportado)
curl -X POST http://localhost:3001/api/albuns/<ALBUM_ID>/cover -H "Authorization: Bearer <ADMIN_TOKEN>" -F "cover=@/caminho/para/cover.jpg"

# 13 - Criar álbum com dados extras
curl -X POST http://localhost:3001/api/albuns -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"titulo":"Extra Álbum","artistaId":"<ARTISTA_ID>","descricao":"Descrição extra"}'

# 14 - Criar álbuns em sequência
curl -X POST http://localhost:3001/api/albuns -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"titulo":"Bulk Álbum 1","artistaId":"<ARTISTA_ID>"}'
curl -X POST http://localhost:3001/api/albuns -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"titulo":"Bulk Álbum 2","artistaId":"<ARTISTA_ID>"}'

# 15 - Obter álbum inválido -> erro
curl -X GET http://localhost:3001/api/albuns/000000000000000000000000 -H "Accept: application/json"
```

## Músicas

```bash
# 1 - Criar música (admin)
curl -X POST http://localhost:3001/api/musicas -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"numero":1,"titulo":"Música Teste","tempo":"3:45","albumId":"<ALBUM_ID>"}'

# 2 - Criar música sem admin -> deve falhar
curl -X POST http://localhost:3001/api/musicas -H "Content-Type: application/json" -d '{"numero":2,"titulo":"SemAdmin","tempo":"4:00","albumId":"<ALBUM_ID>"}'

# 3 - Criar música sem albumId -> validação
curl -X POST http://localhost:3001/api/musicas -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"numero":3,"titulo":"SemAlbum","tempo":"4:20"}'

# 4 - Listar músicas
curl -X GET http://localhost:3001/api/musicas -H "Accept: application/json"

# 5 - Obter música por ID
curl -X GET http://localhost:3001/api/musicas/<MUSICA_ID> -H "Accept: application/json"

# 6 - Atualizar música (admin)
curl -X PUT http://localhost:3001/api/musicas/<MUSICA_ID> -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"titulo":"Música Alterada","tempo":"4:00"}'

# 7 - Atualizar número/ordem da música
curl -X PUT http://localhost:3001/api/musicas/<MUSICA_ID> -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"numero":7}'

# 8 - Atualizar música sem admin -> deve falhar
curl -X PUT http://localhost:3001/api/musicas/<MUSICA_ID> -H "Content-Type: application/json" -H "Authorization: Bearer <USER_TOKEN>" -d '{"titulo":"Tentativa"}'

# 9 - Deletar música (admin)
curl -X DELETE http://localhost:3001/api/musicas/<MUSICA_ID> -H "Authorization: Bearer <ADMIN_TOKEN>"

# 10 - Deletar música sem admin -> deve falhar
curl -X DELETE http://localhost:3001/api/musicas/<MUSICA_ID> -H "Authorization: Bearer <USER_TOKEN>"

# 11 - Listar músicas por álbum
curl -X GET "http://localhost:3001/api/musicas?albumId=<ALBUM_ID>" -H "Accept: application/json"

# 12 - Buscar músicas por título
curl -X GET "http://localhost:3001/api/musicas?q=Teste" -H "Accept: application/json"

# 13 - Criar música com campo extra
curl -X POST http://localhost:3001/api/musicas -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"numero":4,"titulo":"ComExtra","tempo":"2:50","albumId":"<ALBUM_ID>","extra":"valor"}'

# 14 - Criar músicas em sequência
curl -X POST http://localhost:3001/api/musicas -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"numero":5,"titulo":"Bulk 1","tempo":"3:30","albumId":"<ALBUM_ID>"}'
curl -X POST http://localhost:3001/api/musicas -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"numero":6,"titulo":"Bulk 2","tempo":"3:55","albumId":"<ALBUM_ID>"}'

# 15 - Obter música inválida -> erro
curl -X GET http://localhost:3001/api/musicas/000000000000000000000000 -H "Accept: application/json"
```

## Usuários

```bash
# 1 - Registrar usuário
curl -X POST http://localhost:3001/api/auth/signup -H "Content-Type: application/json" -d '{"username":"user1","email":"user1@example.com","password":"Senha123"}'

# 2 - Login de usuário
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"user1@example.com","password":"Senha123"}'

# 3 - Login admin
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@email.com","password":"SenhaAdmin"}'

# 4 - Listar usuários (admin)
curl -X GET http://localhost:3001/api/users -H "Authorization: Bearer <ADMIN_TOKEN>" -H "Accept: application/json"

# 5 - Obter usuário por ID (admin)
curl -X GET http://localhost:3001/api/users/<USER_ID> -H "Authorization: Bearer <ADMIN_TOKEN>" -H "Accept: application/json"

# 6 - Atualizar perfil próprio (autenticado)
curl -X PUT http://localhost:3001/api/users/<USER_ID> -H "Content-Type: application/json" -H "Authorization: Bearer <USER_TOKEN>" -d '{"username":"user1novo","email":"novo@example.com"}'

# 7 - Atualizar usuário (admin)
curl -X PUT http://localhost:3001/api/users/<USER_ID> -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"isAdmin":true}'

# 8 - Listar usuários sem token -> deve falhar
curl -X GET http://localhost:3001/api/users -H "Accept: application/json"

# 9 - Deletar usuário (admin)
curl -X DELETE http://localhost:3001/api/users/<USER_ID> -H "Authorization: Bearer <ADMIN_TOKEN>"

# 10 - Deletar próprio usuário (autenticado)
curl -X DELETE http://localhost:3001/api/users/<USER_ID> -H "Authorization: Bearer <USER_TOKEN>"

# 11 - Buscar usuário por email (admin)
curl -X GET "http://localhost:3001/api/users?email=user1@example.com" -H "Authorization: Bearer <ADMIN_TOKEN>"

# 12 - Registrar usuário com dados inválidos
curl -X POST http://localhost:3001/api/auth/signup -H "Content-Type: application/json" -d '{"username":"","email":"invalid","password":"1"}'

# 13 - Requisição de reset de senha (se existir)
curl -X POST http://localhost:3001/api/auth/forgot -H "Content-Type: application/json" -d '{"email":"user1@example.com"}'

# 14 - Criar usuários em sequência
curl -X POST http://localhost:3001/api/auth/signup -H "Content-Type: application/json" -d '{"username":"bulk1","email":"bulk1@example.com","password":"Senha123"}'
curl -X POST http://localhost:3001/api/auth/signup -H "Content-Type: application/json" -d '{"username":"bulk2","email":"bulk2@example.com","password":"Senha123"}'

# 15 - Obter usuário inválido -> erro
curl -X GET http://localhost:3001/api/users/000000000000000000000000 -H "Authorization: Bearer <ADMIN_TOKEN>" -H "Accept: application/json"
```

## Avaliações

```bash
# 1 - Criar review (usuário autenticado)
curl -X POST http://localhost:3001/api/reviews -H "Content-Type: application/json" -H "Authorization: Bearer <USER_TOKEN>" -d '{"album":"Álbum Teste","artist":"Artista Teste","rating":5,"comment":"Ótima música!"}'

# 2 - Criar review sem token -> deve falhar
curl -X POST http://localhost:3001/api/reviews -H "Content-Type: application/json" -d '{"album":"Álbum Teste","artist":"Artista Teste","rating":4,"comment":"Sem token"}'

# 3 - Criar review com nota inválida -> validação
curl -X POST http://localhost:3001/api/reviews -H "Content-Type: application/json" -H "Authorization: Bearer <USER_TOKEN>" -d '{"album":"Álbum Teste","artist":"Artista Teste","rating":10,"comment":"Nota inválida"}'

# 4 - Listar reviews
curl -X GET http://localhost:3001/api/reviews -H "Accept: application/json"

# 5 - Obter review por ID
curl -X GET http://localhost:3001/api/reviews/<REVIEW_ID> -H "Accept: application/json"

# 6 - Atualizar review (autor) - se suportado
curl -X PUT http://localhost:3001/api/reviews/<REVIEW_ID> -H "Content-Type: application/json" -H "Authorization: Bearer <USER_TOKEN>" -d '{"rating":4,"comment":"Atualizada"}'

# 7 - Atualizar review por outro usuário -> deve falhar
curl -X PUT http://localhost:3001/api/reviews/<REVIEW_ID> -H "Content-Type: application/json" -H "Authorization: Bearer <OTHER_USER_TOKEN>" -d '{"comment":"Tentativa"}'

# 8 - Deletar review (autor)
curl -X DELETE http://localhost:3001/api/reviews/<REVIEW_ID> -H "Authorization: Bearer <USER_TOKEN>"

# 9 - Deletar review (admin)
curl -X DELETE http://localhost:3001/api/reviews/<REVIEW_ID> -H "Authorization: Bearer <ADMIN_TOKEN>"

# 10 - Deletar review por usuário não autorizado -> deve falhar
curl -X DELETE http://localhost:3001/api/reviews/<REVIEW_ID> -H "Authorization: Bearer <OTHER_USER_TOKEN>"

# 11 - Listar reviews por álbum
curl -X GET "http://localhost:3001/api/reviews?album=<ALBUM_ID>" -H "Accept: application/json"

# 12 - Listar reviews por usuário
curl -X GET "http://localhost:3001/api/reviews?user=<USER_ID>" -H "Accept: application/json"

# 13 - Criar review com campo extra
curl -X POST http://localhost:3001/api/reviews -H "Content-Type: application/json" -H "Authorization: Bearer <USER_TOKEN>" -d '{"album":"Álbum Extra","artist":"Artista Extra","rating":3,"comment":"Com extra","extra":"valor"}'

# 14 - Criar reviews em sequência
curl -X POST http://localhost:3001/api/reviews -H "Content-Type: application/json" -H "Authorization: Bearer <USER_TOKEN>" -d '{"album":"Álbum 1","artist":"Artista 1","rating":5,"comment":"Bulk1"}'
curl -X POST http://localhost:3001/api/reviews -H "Content-Type: application/json" -H "Authorization: Bearer <USER_TOKEN>" -d '{"album":"Álbum 2","artist":"Artista 2","rating":4,"comment":"Bulk2"}'

# 15 - Obter review inválido -> erro
curl -X GET http://localhost:3001/api/reviews/000000000000000000000000 -H "Accept: application/json"
```
