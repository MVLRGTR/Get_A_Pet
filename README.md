# 📋 GetAPet : Projeto Full Stack para adoções de pet

> Projeto Criado durante o curso **Node.js do Zero a Maestria** com diversos Projetos de Matheus Battisti (Hora de Codar).

O projeto tem como objetivo trazer o aprendizado de uma arquitetura **API RESTful**, sendo o projeto composto por autenticação, utilização do Banco NoSQL (MongoDB), utilização de ODM (Mongoose) e todo fluxo da arquitetura MVC/Service.

---

## 📋 FUNCIONALIDADES ADICIONADAS

### ⚙️ BACKEND

- ✅ **1. Descrição do Pet**
- ✅ **2. Validação de E-mail**
- ✅ **3. Recuperação de Senha**
- ✅ **4. Envio de e-mail** (Recuperação de senha)
- ✅ **5. Envio, visualização e recuperação de mensagem**
- ✅ **6. Mudança na controller e na modelagem de dados do BD** (Permitir mais de um pedido de adoção por pet)
    - ✅ Adicionar mais de um adotante por vez
    - ✅ Concluir adoção e excluir outros possíveis adotantes
    - ✅ Tirar pet da adoção por parte do tutor atual
    - ✅ Desistência da adoção por parte do adotante
    - ✅ Retorno dos pets adotados e com requisição de adoção do usuário
- ✅ **7. Status da adoção por notificação**
    - ✅ Notificação de conclusão de adoção
    - ✅ Notificação de pet retirado da adoção
    - ✅ Notificação de pet adotado por outro tutor
    - ✅ Notificação de mensagem de outro tutor da plataforma
- ✅ **8. Inclusão de endereço do usuário**
- ✅ **9. Vinculação do endereço do pet com o tutor atual**
- ✅ **10. Regra de Negócio:** Usuário só poderá adicionar um novo pet ou adotar caso tenha endereço cadastrado
- ✅ **11. Lista de pets favoritos**
    - ✅ Adicionar Pets à lista
    - ✅ Excluir Pets da lista
- ✅ **12. Geolocalização:** Colocar em ordem os pets mais próximos de acordo com o CEP (caso tenha essa informação)
- ✅ **13. Limpeza:** Ao excluir um pet, remover os arquivos associados
- ✅ **14. Segurança de Rotas:** Após a adoção, a requisição `petbyid` só funciona para o tutor atual e o antigo
    - ✅ Requisição `petbyid`
    - ✅ Requisição `updatepetbyid`
    - ✅ Requisição `deletepetbyid`
- ✅ **15. Sistema de E-mails**
    - ✅ E-mail de verificação de conta
    - ✅ E-mail de token para mudança de senha
    - ✅ Enviar e-mail para todos os usuários quando um novo pet for adicionado (com link)
    - ✅ E-mail de novas mensagens
    - ✅ E-mail de requisição de adoção
    - ✅ E-mail de conclusão de adoção (para tutor e adotante)
    - ✅ E-mail de desistência de adoção por parte do adotante
    - ✅ E-mail de Pet deletado
    - ✅ Botão de "Opt-out" (não receber e-mails, exceto login/senha)
- ✅ **16. Validação com Zod**
    - ✅ Pet Validation
        - ✅ Create
        - ✅ Adoption request
        - ✅ EditPet
    - ✅ User Validation
        - ✅ Register
        - ✅ Edit User
        - ✅ AddressEdit
        - ✅ ReceiverEmail
    - ✅ Notification Validation
    - ✅ Message Validation
- ✅ **17. Paginação**
    - ✅ Search Users
    - ✅ PetsAll
    - ✅ Search Pets
    - ✅ MyPets
    - ✅ MyAdoptions
- ⬜ **18. SMS**
    - ⬜ SMS de recuperação de conta
- ✅ **19. Configuração das variáveis de ambiente**
- ✅ **20. Tratamento de erros da API**
- ✅ **21. Buscar um pet**
- ✅ **22. Buscar um tutor ou todos**
- ⬜ **23. Fale conosco**
- ⬜ **24. Área de Administração**
    - ⬜ Mudanças de senhas
    - ⬜ Editar informações de Usuários
    - ⬜ Editar e apagar um pet de um usuário
    - ⬜ Inclusão de campos a serem preenchidos
    - ⬜ Log de ações (Tudo que for feito)
    - ⬜ Criação de Usuários com privilégios (subalternos ao root)
    - ⬜ Ver estatísticas da plataforma
        - ⬜ Ver Todos os Usuários e Pets
        - ⬜ Ver Todos os processos de adoções

---

### 💻 FRONTEND

- ✅ **1. Página de validação de e-mail**
- ✅ **2. Página recuperação de senha**
- ✅ **3. Formulário de descrição do pet**
- ✅ **4. Página Envio de e-mail** (Recuperação de senha)
- ⬜ **5. Área de mensagem** (Envio e recuperação de mensagens)
    - ⬜ Página para Mostrar Tutores
    - ✅ Área de Mensagens
- ✅ **6. Adição do componente busca de um Pet**
- ⬜ **7. Adição do componente busca de um tutor**
- ⬜ **8. Adicionar componente de enviar mensagem na página da descrição do Pet**
- ✅ **9. Página minhas adoções** (mostrar os tutores interessados em um pet específico)
- ⬜ **10. Página de tutores**
- ✅ **11. Mostrar pets mais perto de acordo com a localização**
- ⬜ **12. Abrir a localização no maps do pet em questão** (Integração back e frontend)