Projeto Criado durante o curso Node.js do Zero a Maestria com diversos Projetos de Matheus Battisti (Hora de Codar)

O projeto tem como objetivo trazer o aprendizado de uma arquitetura API.RESTFULL, sendo o projeto composto por autenticação , Utilização do Banco NoSQL , utilização de ODM que no caso é o Mongoose e toda parte de fluxo da arquitetura em questão.

algumas funções foram adicionadas por min , abaixo listarei elas

FUNCIONALIDADES ADICIONADAS :

BACKEND :

1º  [x] => Descrição do Pet
2º  [x] => Validação de E-mail
3º  [x] => Recuperação de Senha
4º  [x] => Envio de e-mail (Recuperação de senha )
5º  [x] => Envio , visualização e recuperaçãode mensagem
6º  [x] => Mudança na controller e na modelagem de dados do bd (Permitir mais de um pedido de adoção por pet)
        [x] : -Adicionar mais de um adotante por vez
        [x] : -Concluir adoção e excluir ostros possiveis adotantes
        [x] : -Tirar pet da adoção por parte do tutor atual
        [x] : -Desistencia da adoção por parte do adotante
        [x] : -Retorno dos pets adotados e com requisição de adoção do usuario
7º  [x] => Status da adoção por notificação
        [x] : -Notificação de conclusão de adoção
        [x] : -Notificação de pet retirado da adoção
        [x] : -Notificação de pet adotado por outro tutor
        [x] : -Notificação de mensagem de outro tutor da plataforma
8º  [x] => Inclusão de endereço do usuario 
8º  [x] => Vinculação do endereço do pet com o tutor atual  
8º  [x] => Usuario so podera adicionar um novo pet ou adotar caso tenha endereço cadastrado na plataforma
8º  [x] => Lista de pets favoritos
        [x] : -Adicionar Pets a lista
        [x] : -Exlcuir Pets da lista
8º  [x] => Colocar em ordem os pets mais proximos de acordo com o cep fornecido caso tenha  essa informação
8º  [x] => Ao excluir um pet , remover os arquivos do pet associado
8º  [x] => Após a adoção do pet a requisição petbyid so funcionar para o tutor atual e o tutor que disponibilizou o pet na plataforma
        [x] : Requisição petbyid
        [x] : requisição updatepetbyid
        [x] : deletepetbyid
9º  [] => E-mail
        [x] : E-mail de verificação de conta
        [x] : E-mail de token para mudança de senha
        [x] : Enviar e-mail para todos os usuarios quando um novo pet for adicionado a plataforma , bem como o link 
        [x] : E-mail de novas mensagens 
        [x] : E-mail de requisição de adoção
        [x] : E-mail de conclusão de adoção para o tutor e adotante
        [] : E-mail de desistencia de adoção por parte do adopter
        [] : E-mail de Pet deletado
        [x] : Botão de não receber e-mail , somente o e-mail de primarylogin ou o de forgotpassword que ainda continuarão funcionado 
9º  [] => Zod Validation
        [] : Pet Validation
                [x] : Create
                [x] : Adoption request
                [x] : EditPet
        [] : User validation
        [] : Notification Validation
        [] : Message Validation
9º  [] => SMS 
        [] : SMS de recuperação de conta 
8º  [x] => Confgiguração das variaveis de ambiente
8º  [] => Abrir a localização no maps do pet em questão (Integração back e frontend)
9º  [] => Tratamento de erros da API
10º [] => Buscar um pet 
11º [] => Buscar um tutor ou todos 
12º [] => Fale conosco
13º [] : Área de Administração 
       [] : -Mudanças de senhas
       [] : -Editar informações de Usuarios 
       [] : -Editar e apagar um pet de um usuario
       [] : -Inclusão de campos a serem preechidos
       [] : -Tudo que for feito
       [] : -Criação de Usuarios com privilegios mas subalternos ao root
       [] : -Ver estatísticas da plataforma
                [] : -Ver Todos os Usuarios e Pets
                [] : -Ver Todos os processos de adoções

FRONTEND :

1º  [x] => Pagina de validação de e-mail
2º  [x] => Pagina recuperação de senha 
3º  [x] => Formulario de descrição do pet
4º  [x] => Pagina Envio de e-mail (Recuperação de senha )
5º  [] => Área de mensagem (Envio e recuperação de mensagens)
        [] - Pagina para Mostrar Tutores 
        [] - Área de Mensagens
6º  [] => Adição do componente busca de um Pet
7º  [] => Adição do componente busca de um tutor
8º  [] => Adicionar componente de enviar mensagem no pagina da descrição do Pet
9º  [] => Pagina minhas adoções mostrar os tutores interessados em um pet especifico
10º [] => Pagina de tutores
11º [] => Mostrar pets mais perto de acordo com a localização