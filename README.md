# 📋 GetAPet - Projeto Full Stack para adoções de pet

> Projeto criado durante o curso **Node.js do Zero a Maestria** com diversos projetos de Matheus Battisti (Hora de Codar).

O projeto tem como objetivo trazer o aprendizado de uma arquitetura **API RESTful**, sendo composto por:
- Autenticação
- Utilização de Banco NoSQL (MongoDB)
- Utilização de ODM (Mongoose)
- Fluxo completo da arquitetura MVC/Service.

---

## 🚀 Funcionalidades Adicionadas

### Backend

- [x] **1. Descrição do Pet**
- [x] **2. Validação de E-mail**
- [x] **3. Recuperação de Senha**
- [x] **4. Envio de e-mail** (Recuperação de senha)
- [x] **5. Envio, visualização e recuperação de mensagem**
- [x] **6. Mudança na controller e na modelagem de dados do BD** (Permitir mais de um pedido de adoção por pet)
    - [x] Adicionar mais de um adotante por vez
    - [x] Concluir adoção e excluir outros possíveis adotantes
    - [x] Tirar pet da adoção por parte do tutor atual
    - [x] Desistência da adoção por parte do adotante
    - [x] Retorno dos pets adotados e com requisição de adoção do usuário
- [x] **7. Status da adoção por notificação**
    - [x] Notificação de conclusão de adoção
    - [x] Notificação de pet retirado da adoção
    - [x] Notificação de pet adotado por outro tutor
    - [x] Notificação de mensagem de outro tutor da plataforma
- [x] **8. Inclusão de endereço do usuário**
- [x] **9. Vinculação do endereço do pet com o tutor atual**
- [x] **10. Regra de Negócio:** Usuário só poderá adicionar um novo pet ou adotar caso tenha endereço cadastrado
- [x] **11. Lista de pets favoritos**
    - [x] Adicionar Pets à lista
    - [x] Excluir Pets da lista
- [x] **12. Geolocalização:** Colocar em ordem os pets mais próximos de acordo com o CEP (caso tenha essa informação)
- [x] **13. Limpeza:** Ao excluir um pet, remover os arquivos associados
- [x] **14. Segurança de Rotas:** Após a adoção, a requisição `petbyid` só funciona para o tutor atual e o antigo
    - [x] Requisição `petbyid`
    - [x] Requisição `updatepetbyid`
    - [x] Requisição `deletepetbyid`
- [x] **15. Sistema de E-mails**
    - [x] E-mail de verificação de conta
    - [x] E-mail de token para mudança de senha
    - [x] Alerta para todos os usuários quando um novo pet for adicionado (com link)
    - [x] E-mail de novas mensagens
    - [x] E-mail de requisição de adoção
    - [x] E-mail de conclusão de adoção (para tutor e adotante)
    - [x] E-mail de desistência de adoção por parte do adotante
    - [x] E-mail de Pet deletado
    - [x] Botão de "Opt-out" (não receber e-mails, exceto login/senha)
- [x] **16. Validação com Zod**
    - [x] Pet Validation
        - [x] Create
        - [x] Adoption request
        - [x] EditPet
    - [x] User Validation
        - [x] Register
        - [x] Edit User
        - [x] AddressEdit
        - [x] ReceiverEmail
    - [x] Notification Validation
    - [x] Message Validation
- [ ] **17. Paginação**
    - [x] Search Users
    - [x] PetsAll
    - [x] Search Pets
    - [x] MyPets
    - [x] MyAdoptions
- [ ] **18. SMS**
    - [ ] SMS de recuperação de conta
- [x] **19. Configuração das variáveis de ambiente**
- [x] **20. Tratamento de erros da API**
- [x] **21. Buscar um pet**
- [x] **22. Buscar um tutor ou todos**
- [ ] **23. Fale conosco**
- [ ] **24. Área de Administração**
    - [ ] Mudanças de senhas
    - [ ] Editar informações de Usuários
    - [ ] Editar e apagar um pet de um usuário
    - [ ] Inclusão de campos a serem preenchidos
    - [ ] Log de ações (Tudo que for feito)
    - [ ] Criação de Usuários com privilégios (subalternos ao root)
    - [ ] Ver estatísticas da plataforma
        - [ ] Ver Todos os Usuários e Pets
        - [ ] Ver Todos os processos de adoções