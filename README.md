Projeto Criado durante o curso Node.js do Zero a Maestria com diversos Projetos de Matheus Battisti (Hora de Codar)

O projeto tem como objetivo trazer o aprendizado de uma arquitetura API.RESTFULL, sendo o projeto composto por autenticação , Utilização do Banco NoSQL , utilização de ODM que no caso é o Mongoose e toda parte de fluxo da arquitetura em questão.

algumas funções foram adicionadas por min , abaixo listarei elas

FUNCIONALIDADES ADICIONADAS :

1º [x] : Parte de descrição do pet
2º [x] : validação de e-mail para primeiro acesso
3º [x] : Recuperação de senha
4º [] : Área de chat entre os tutores
5º [] : Área de Administração 
       [] : -Mudanças de senhas
       [] : -Apagar comentarios 
       [] : -Editar informações de Usuarios 
       [] : -Editar e apagar um pet de um usuario
       [] : -Inclusão de campos a serem preechidos
       [] : -Tudo que for feito
       [] : -Criação de Usuarios com privilegios mas subalternos ao root
       [] : -Ver estatísticas da plataforma
                [] : -Ver Todos os Usuarios e Pets
                [] : -Ver Todos os processos de adoções
6º [] : Área de notificações no frontend com links para as ações
7º [] : Permitir mais de uma visita para um pet (No modelo atual quando se solicita uma visita o pet fica travado para aquele usuario , não permitindo que outras pessoas visitem o pet  até que seja dada uma negativa por parte do dono do pet , para que assim ele fique livre novamente)
8º [] : Notificações na pagina , de atualizações de mensagens e status da adoção.
9º [] : Fazer o Processo de marcar a visita e conclusão da adoção
        [] : -O possivel adotande solicita uma visita para o tutor atual 
        [] : -O tutor atual aceita a visita para o dia proposto 
        [] : -Caso tudo de certo o tutor da um conclude adopter e caso o pet tenha outras outras visitas agendadas a mesmas são canceladas avisando que o pet já foi adotado
10º [] : Notifiações por e-mail
        [] : -Solicitações de visitas para o seu pet tutoriado
        [] : -Conclusão de adoções 
        [] : -Notificação na data da visita para o pet
11º [] : Melhorias na API
        [] : -Tratamento de entradas de dados
        [] : -Erros de segurança
12º [] : Tutor atual fazer recusa da adoção bem como o possivel adotante desisti da adoção tembém , unilateralidade das ações de adoção
13º [] : Paginas de Mensagens Frontend

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
        [] : -Desistencia da adoção por parte do tutor atual
        [x] : -Desistencia da adoção por parte do adotante
        [] : -Retorno dos pets do usuario
7º  [] => Status da adoção
8º  [] => Tratamentos de dados 
9º  [] => Tratamento de erros da API
10º [] => Unilateralidade de do processo de adoção 
11º [] => Buscar um pet 
12º [] => Buscar um tutor ou todos 
13º [] => Fale conosco
14º [] : Área de Administração 
       [] : -Mudanças de senhas
       [] : -Apagar comentarios 
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