import styles from './About.module.css'
import { useNavigate } from 'react-router-dom'

function About() {
    const navigate = useNavigate()

    function handleNavigate(){
        navigate(`/1`)
        console.log('entrou aqui')
    }

    function handleNavigateToGit(){
        window.open('https://github.com/MVLRGTR/Get_A_Pet', '_blank')
    }

    return (
        <section className={styles.sectionbody}>
            <h1>Bem vindo ao GetAPet !!!</h1>
            <img src={`${process.env.REACT_APP_API}images/pets/icongetapet.jpg`} className={styles.aboutimg} ></img>
            <p> Esse Projeto foi Criado durante o curso Node.js do Zero a Maestria com diversos Projetos de Matheus Battisti (Hora de Codar)

                O projeto tem como objetivo trazer o aprendizado de uma arquitetura API.RESTFULL, sendo o projeto composto por autenticação , Utilização do Banco NoSQL , utilização de ODM que no caso é o Mongoose e toda parte de fluxo da arquitetura em questão. Além disso foram adicionados varias funcionalidades ao projeto para poder engrandecer ainda mais o aprendizado durante o curso.
            </p>

            <div className={styles.list}>
                <h2>Funcionalidades Adicionadas :</h2>
                <ol>
                    <li> Descrição do pet</li>
                    <li>Validação de E-mail</li>
                    <li>Recuperação de Senha</li>
                    <li>Envio de e-mail (Recuperação de senha)</li>
                    <li>Envio, visualização e recuperação de mensagem</li>
                    <li>Mudança na controller e na modelagem de dados do bd (Permitir mais de um pedido de adoção por pet)
                        <ul>
                            <li>Adicionar mais de um adotante por vez</li>
                            <li>Concluir adoção e excluir outros possíveis adotantes</li>
                            <li>Tirar pet da adoção por parte do tutor atual</li>
                            <li>Desistência da adoção por parte do adotante</li>
                            <li>Retorno dos pets adotados e com requisição de adoção do usuário</li>
                        </ul>
                    </li>
                    <li>Status da adoção por notificação
                        <ul>
                            <li>Notificação de conclusão de adoção</li>
                            <li>Notificação de pet retirado da adoção</li>
                            <li>Notificação de pet adotado por outro tutor</li>
                            <li>Notificação de mensagem de outro tutor da plataforma</li>
                        </ul>
                    </li>
                    <li>Inclusão de endereço do usuário</li>
                    <li>Vinculação do endereço do pet com o tutor atual</li>
                    <li>Usuário só poderá adicionar um novo pet ou adotar caso tenha endereço cadastrado na plataforma</li>
                    <li>Lista de pets favoritos
                        <ul>
                            <li>Adicionar Pets à lista</li>
                            <li>Excluir Pets da lista</li>
                        </ul>
                    </li>
                    <li>Colocar em ordem os pets mais próximos de acordo com o CEP fornecido caso tenha essa informação</li>
                    <li>Ao excluir um pet, remover os arquivos do pet associado</li>
                    <li>Após a adoção do pet, a requisição petbyid só funcionará para o tutor atual e o tutor que disponibilizou o pet na plataforma
                        <ul>
                            <li>Requisição petbyid</li>
                            <li>Requisição updatepetbyid</li>
                            <li>Deletar Pet por Id</li>
                        </ul>
                    </li>
                    <li>E-mail
                        <ul>
                            <li>E-mail de verificação de conta</li>
                            <li>E-mail de token para mudança de senha</li>
                            <li>Enviar e-mail para todos os usuários quando um novo pet for adicionado à plataforma, bem como o link</li>
                            <li>E-mail de novas mensagens</li>
                            <li>E-mail de requisição de adoção</li>
                            <li>E-mail de conclusão de adoção para o tutor e adotante</li>
                            <li>E-mail de desistência de adoção por parte do adotante</li>
                            <li>E-mail de Pet deletado</li>
                            <li>Botão de não receber e-mail, somente o e-mail de primarylogin ou o de forgotpassword continuarão funcionando</li>
                        </ul>
                    </li>
                    <li>Zod Validation
                        <ul>
                            <li>Pet Validation
                                <ul>
                                    <li>Create</li>
                                    <li>Adoption request</li>
                                    <li>EditPet</li>
                                </ul>
                            </li>
                            <li>User validation
                                <ul>
                                    <li>Register</li>
                                    <li>Edit User</li>
                                    <li>AddressEdit</li>
                                    <li>ReceiverEmail</li>
                                </ul>
                            </li>
                            <li>Notification Validation</li>
                            <li>Message Validation</li>
                        </ul>
                    </li>
                    <li>Paginação
                        <ul>
                            <li>Search Users</li>
                            <li>PetsAll</li>
                            <li>Search Pets</li>
                            <li>MyPets</li>
                            <li>MyAdoptions</li>
                        </ul>
                    </li>
                    <li>Configuração das variáveis de ambiente</li>
                    <li>Tratamento de erros da API</li>
                    <li>Buscar um pet</li>
                    <li>Buscar um tutor ou todos</li>
                </ol>
            </div>
            <div className={styles.logo} onClick={handleNavigateToGit}>
                <img src="/logogithub.png" alt='logo github'></img>
                <p>Link Repositório </p>
            </div>
            <button className={styles.butonabout} type='button' onClick={handleNavigate}>conhecer a plataforma</button>

        </section>
    )
}

export default About