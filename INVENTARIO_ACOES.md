# 📋 INVENTÁRIO COMPLETO DE AÇÕES - INTEGRAÇÃO FRONTEND + BACKEND

**Data:** 30 de Maio de 2026  
**Status:** Planejamento completo - Pronto para implementação  
**Objetivo:** Integração total, responsividade e máscaras de formulário

---

## 🔴 PROBLEMAS CRÍTICOS ENCONTRADOS

### 1. **Endpoints com Prefixo Incorreto**
- **Problema:** Frontend chama `http://localhost:3001/albuns` mas backend espera `http://localhost:3001/api/albuns`
- **Impacto:** Todas as chamadas do store retornam 404
- **Solução:** Adicionar `/api` em todas as URLs no `useAlbumStore.js`

### 2. **Rotas de API Incompletas**
| Rota | Status | Ação |
|------|--------|------|
| `/api/albuns` | ⚠️ Incompleto | Adicionar GET/:id, PUT, DELETE |
| `/api/artistas` | ❌ NÃO EXISTE | Criar do zero |
| `/api/musicas` | ❌ NÃO EXISTE | Avaliar necessidade |
| Autenticação em `/api/albuns` | ❌ FALTANDO | Adicionar middlewares |

### 3. **Formulários com Problemas**
- **EditarPerfil.jsx:** Formulário 100% não funcional (sem handlers, sem estado)
- **SuaAvaliacao.jsx:** Rating hardcoded em 5 (usuário não consegue escolher)
- **Admin.jsx:** Sem máscaras, sem validações

### 4. **Responsividade Faltando**
- Header.css: Sem @media queries
- Admin.css: Sem @media queries
- EditarPerfil.css: Sem @media queries
- Menu não é mobile-friendly

---

## 🟡 PROBLEMAS MODERADOS

1. **Páginas Vazias:** Artistas.jsx, Albuns.jsx, Listas.jsx não exibem dados
2. **Integração Parcial:** Algumas páginas chamam API de forma incorreta
3. **Validações Ausentes:** Formulários aceitam dados inválidos
4. **Delete de Reviews:** Não implementado no frontend

---

## ✅ AÇÕES A EXECUTAR (ORDEM LÓGICA)

### **FASE 1: BACKEND (Routes + Validação) - 8 ações**

#### Backend/Routes - Reparos
```
□ AÇÃO B1: Verificar routes/Album.js
  - Status atual: GET /api/albuns, POST /api/albuns (incompleto)
  - Necessário: GET /:id, PUT /:id, DELETE /:id
  - Adicionar autenticação em POST
  - Arquivo: backend/routes/Album.js

□ AÇÃO B2: Criar routes/artistas.js
  - Endpoints necessários:
    ✓ GET /api/artistas (listar todos)
    ✓ POST /api/artistas (criar novo)
    ✓ GET /api/artistas/:id (um artista)
  - Auth: POST requer token
  - Arquivo: backend/routes/artistas.js (NOVO)

□ AÇÃO B3: Verificar models/Artista.js
  - Validações e campos
  - Arquivo: backend/models/Artista.js

□ AÇÃO B4: Registrar rotas em app.js
  - Adicionar: app.use("/api/artistas", artistasRoutes);
  - Arquivo: backend/app.js

□ AÇÃO B5: Avaliar necessidade de /api/musicas
  - Se necessário, criar routes/musicas.js
  - Caso contrário, atualizar frontend para não chamar
  - Arquivo: backend/routes/musicas.js (CONDICIONAL)

□ AÇÃO B6: Adicionar autenticação em POST /api/albuns
  - Usar middleware auth
  - Arquivo: backend/routes/Album.js

□ AÇÃO B7: Adicionar validações com express-validator
  - Nome só letras
  - Email válido
  - Rating 1-5
  - Arquivo: backend/routes/* (todos)

□ AÇÃO B8: Testar todas as rotas com Postman/Insomnia
  - GET, POST, PUT, DELETE
  - Auth token
```

---

### **FASE 2: FRONTEND - UTILITIES (Masks + Validators) - 2 ações**

```
□ AÇÃO F1: Criar utils/masks.js
  - Exportar funções de máscara:
    ✓ maskCPF(value) → XXX.XXX.XXX-XX
    ✓ maskPhone(value) → (XX) XXXXX-XXXX
    ✓ maskUsername(value) → sem espaços, lowercase
    ✓ maskEmail(value) → validar formato
    ✓ maskName(value) → só letras e espaços
    ✓ maskBio(value) → máx 500 chars
  - Arquivo: frontend/src/utils/masks.js (NOVO)

□ AÇÃO F2: Criar utils/validators.js
  - Exportar validações:
    ✓ isValidEmail(email)
    ✓ isValidUsername(username) → min 3, sem espaços
    ✓ isValidPassword(pwd) → min 6
    ✓ isValidName(name) → min 2, só letras
    ✓ isValidRating(rating) → 1-5
  - Arquivo: frontend/src/utils/validators.js (NOVO)
```

---

### **FASE 3: FRONTEND - STORE (Corrigir URLs) - 1 ação**

```
□ AÇÃO F3: Atualizar useAlbumStore.js
  Mudanças necessárias:
  
  ANTES:
  - fetch('http://localhost:3001/albuns')
  - fetch('http://localhost:3001/artistas')
  - fetch('http://localhost:3001/avaliacoes')
  
  DEPOIS:
  - fetch('http://localhost:3001/api/albuns')
  - fetch('http://localhost:3001/api/artistas')
  - fetch('http://localhost:3001/api/reviews')
  
  - Adicionar header Authorization para chamadas autenticadas
  - Adicionar proper error handling
  
  Arquivo: frontend/src/store/useAlbumStore.js
```

---

### **FASE 4: FRONTEND - FORMULÁRIOS COM MÁSCARAS - 5 ações**

```
□ AÇÃO F4: Implementar Cadastro.jsx com máscaras
  Campos:
  - username: MaxLength 20, só alfanuméricos/underscore, lowercase
  - email: Validar formato email real-time
  - password: Min 6, feedback força
  - nome (opcional): Só letras e espaços
  
  Adicionar:
  - Máscara em tempo real
  - Validação ao blur
  - Feedback visual (✓/✗)
  
  Arquivo: frontend/src/pages/Cadastro.jsx

□ AÇÃO F5: Implementar Entre.jsx com validações
  Campos:
  - identificador: Username ou email
  - password: Min 6
  
  Adicionar:
  - Detectar se é email ou username
  - Validação ao enviar
  - Mensagens de erro claras
  
  Arquivo: frontend/src/pages/Entre.jsx

□ AÇÃO F6: IMPLEMENTAR EditarPerfil.jsx (COMPLETAMENTE QUEBRADO)
  ⚠️ ESTADO ATUAL: Formulário sem handlers, sem funcionalidade
  
  Necessário:
  - useState para: username, email, bio, nome, senhaAtual, senhaNova
  - onChange handlers para cada campo
  - handleSubmit que chama PUT /api/users/me
  - handlePasswordChange separado (requer senhaNova + senhaAtual)
  - Máscaras: username, email, nome, bio
  - Feedback de sucesso/erro
  - Carregar dados atuais ao abrir página
  
  Arquivo: frontend/src/pages/EditarPerfil.jsx

□ AÇÃO F7: Atualizar Admin.jsx com máscaras
  Campos:
  - titulo: Máx 100 caracteres
  - artista: Seleção de lista (não texto)
  - capa: URL ou upload
  - data: Date picker
  - generos: Multi-select
  - gravadora: Texto
  
  Adicionar:
  - Dropdowns dinâmicos de artistas
  - Data picker formatado
  - Validação completa
  - Upload de imagem se possível
  
  Arquivo: frontend/src/pages/Admin.jsx

□ AÇÃO F8: Atualizar SuaAvaliacao.jsx com rating
  ⚠️ PROBLEMA: Rating hardcoded = 5
  
  Necessário:
  - Rating selecionável (1-5 stars ou radio buttons)
  - Comentário: Máx 500 caracteres, show counter
  - Campo albumId: Seleção de álbuns
  - Campo artistaId: Seleção de artistas
  - Validação: min 1 star obrigatório
  - Exibir nota em tempo real
  
  Arquivo: frontend/src/pages/SuaAvaliacao.jsx
```

---

### **FASE 5: FRONTEND - RESPONSIVIDADE (CSS) - 8 ações**

```
□ AÇÃO F9: Atualizar Header.css
  Adicionar @media queries para:
  - 768px (tablet): Reduzir padding, font-size
  - 480px (mobile): Menu hamburger, layout vertical
  - Problemas específicos:
    ✓ .container padding: 40px → dinâmico
    ✓ font-size: 35px → responsivo
    ✓ gap: 25px → reduzir em mobile
  
  Arquivo: frontend/src/components/Header/Header.css

□ AÇÃO F10: Atualizar Admin.css
  Adicionar @media queries:
  - max-width container em desktop
  - Layout responsivo para mobile
  - .admin-form padding dinâmico
  - Botões full-width em mobile
  
  Arquivo: frontend/src/pages/style/Admin.css

□ AÇÃO F11: Atualizar EditarPerfil.css
  ⚠️ Como o formulário será implementado, precisará de:
  - .navegacao-config menu responsivo (stack em mobile)
  - .perfil-section full-width em mobile
  - Inputs 100% width em mobile
  - Layout grid adaptativo
  
  Arquivo: frontend/src/pages/style/EditarPerfil.css

□ AÇÃO F12: Verificar e atualizar Avaliacao.css
  - Adicionar media queries se faltando
  - .card-avaliacao responsivo
  - Grid adaptativo
  
  Arquivo: frontend/src/components/Avaliacao/Avaliacao.css

□ AÇÃO F13: Verificar e atualizar CardAvaliacao.css
  - Cards responsivos
  - Imagens escaláveis
  - Texto legível em mobile
  
  Arquivo: frontend/src/components/CardAvaliacao/CardAvaliacao.css

□ AÇÃO F14: Verificar e atualizar Busca.css
  - Barra de busca responsiva
  - Dropdown resultados mobile-friendly
  
  Arquivo: frontend/src/components/Busca/Busca.css

□ AÇÃO F15: Atualizar Rodape.css
  - Layout responsivo
  - Stacking em mobile
  
  Arquivo: frontend/src/components/Rodape/Rodape.css

□ AÇÃO F16: Atualizar Home.css se necessário
  - Verificar breakpoints existentes
  - Melhorar se houver gaps
  
  Arquivo: frontend/src/pages/style/Home.css
```

---

### **FASE 6: FRONTEND - PÁGINAS VAZIAS - 4 ações**

```
□ AÇÃO F17: Implementar Artistas.jsx
  Necessário:
  - GET /api/artistas ao carregar
  - Grid responsivo de artistas
  - Busca/filter por nome
  - Link para página individual (Artista.jsx)
  
  Arquivo: frontend/src/pages/Artistas.jsx

□ AÇÃO F18: Implementar Albuns.jsx
  Necessário:
  - GET /api/albuns ao carregar
  - Grid responsivo de álbuns
  - Busca/filter
  - Link para página individual (Album.jsx)
  
  Arquivo: frontend/src/pages/Albuns.jsx

□ AÇÃO F19: Avaliar Listas.jsx
  - Definir funcionalidade
  - Usuário pode criar listas de álbuns?
  - Salvar em localStorage ou database?
  
  Arquivo: frontend/src/pages/Listas.jsx

□ AÇÃO F20: Atualizar Usuario.jsx
  - Adicionar botão "Editar Perfil" que navega para EditarPerfil
  - Exibir suas avaliações
  - Botão logout
  
  Arquivo: frontend/src/pages/Usuario.jsx
```

---

### **FASE 7: INTEGRAÇÕES FINAIS - 3 ações**

```
□ AÇÃO F21: Implementar DELETE de reviews
  - Adicionar botão delete em CardAvaliacao.jsx
  - Chamar DELETE /api/reviews/:id
  - Apenas author pode deletar
  - Confirmação antes de deletar
  
  Arquivo: frontend/src/components/CardAvaliacao/CardAvaliacao.jsx

□ AÇÃO F22: Atualizar PrivateRoute.jsx se necessário
  - Verificar se token está válido
  - Redirecionar para login se expirado
  
  Arquivo: frontend/src/pages/PrivateRoute.jsx

□ AÇÃO F23: Adicionar erro handling em todas as requisições
  - Try-catch em todas as chamadas API
  - Exibir mensagens de erro ao usuário
  - Retry logic para falhas de rede
```

---

## 📊 RESUMO DE MUDANÇAS

### **ARQUIVOS A CRIAR (NOVOS)**
```
backend/routes/artistas.js        ← NOVO
frontend/src/utils/masks.js       ← NOVO
frontend/src/utils/validators.js  ← NOVO
```

### **ARQUIVOS A MODIFICAR (BACKEND)**
```
backend/app.js                    ← Adicionar rota artistas
backend/routes/Album.js           ← Completar CRUD + Auth
```

### **ARQUIVOS A MODIFICAR (FRONTEND - STORE)**
```
frontend/src/store/useAlbumStore.js  ← URLs e endpoints
```

### **ARQUIVOS A MODIFICAR (FRONTEND - PAGES)**
```
frontend/src/pages/Cadastro.jsx         ← Máscaras
frontend/src/pages/Entre.jsx            ← Validações
frontend/src/pages/EditarPerfil.jsx     ← IMPLEMENTAR DO ZERO
frontend/src/pages/Admin.jsx            ← Máscaras + validações
frontend/src/pages/SuaAvaliacao.jsx     ← Rating selecionável
frontend/src/pages/Artistas.jsx         ← Popular com dados
frontend/src/pages/Albuns.jsx           ← Popular com dados
frontend/src/pages/Listas.jsx           ← Definir funcionalidade
frontend/src/pages/Usuario.jsx          ← Melhorar com botões
```

### **ARQUIVOS A MODIFICAR (FRONTEND - COMPONENTS)**
```
frontend/src/components/Header/Header.css           ← Responsivo
frontend/src/components/CardAvaliacao/CardAvaliacao.jsx ← Delete button
frontend/src/components/CardAvaliacao/CardAvaliacao.css ← Responsivo
```

### **ARQUIVOS A MODIFICAR (FRONTEND - STYLES)**
```
frontend/src/pages/style/Admin.css          ← Responsivo
frontend/src/pages/style/EditarPerfil.css   ← Responsivo + nova estrutura
frontend/src/pages/style/Home.css           ← Verificar
frontend/src/components/Avaliacao/Avaliacao.css     ← Responsivo
frontend/src/components/Busca/Busca.css            ← Responsivo
frontend/src/components/Rodape/Rodape.css          ← Responsivo
```

---

## 📈 PROGRESSO

- [x] Análise completa do código
- [x] Identificação de problemas
- [x] Criação de plano de ações
- [ ] **FASE 1: Backend Routes**
- [ ] **FASE 2: Frontend Utilities**
- [ ] **FASE 3: Frontend Store**
- [ ] **FASE 4: Frontend Formulários com Máscaras**
- [ ] **FASE 5: Responsividade CSS**
- [ ] **FASE 6: Páginas Vazias**
- [ ] **FASE 7: Integrações Finais**
- [ ] Testes e validação
- [ ] Deploy

---

## 🎯 OBJETIVO FINAL

✅ Frontend 100% integrado com Backend  
✅ Todas as páginas responsivas (mobile, tablet, desktop)  
✅ Todos os formulários com máscaras e validações  
✅ Aplicação funcionando perfeitamente  

---

**Criado:** 30 de Maio de 2026  
**Próximo passo:** Iniciar FASE 1 - Backend Routes
