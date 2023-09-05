# PROJETO WEB SAÚDE

## EQUIPE

- Francisco Eric Santos - Full-stack
- Yuck Gabriel Nascimento Guedes - Full-stack

## ARQUITETURA DE PASTAS

Este projeto segue uma arquitetura de pastas organizada para manter o código bem estruturado e modular. Aqui está a organização das pastas:

- **models:** Contém as definições dos modelos de dados usados no aplicativo para representar entidades como usuários, hospitais, clínicas, etc.

- **services:** Inclui serviços reutilizáveis que executam tarefas específicas em nosso aplicativo, como autenticação de usuário, geocodificação de endereços, etc.

- **controllers:** Esta pasta contém controladores que lidam com as solicitações HTTP, chamam serviços correspondentes e enviam respostas de volta aos clientes. Isso ajuda a manter nossas rotas limpas e organizadas.

- **repositories:** Se você estiver trabalhando com um banco de dados, esta pasta abstrai as operações de banco de dados. Cada repositório pode conter funções para criar, ler, atualizar ou excluir registros no banco de dados.

- **routes:** As definições de rotas nesta pasta mapeiam URLs do aplicativo para funções de controlador correspondentes. Isso ajuda a organizar as diferentes partes do seu aplicativo e a lidar com solicitações de maneira estruturada.

## TECNOLOGIAS FRONT-END

- Next.js (Javascript)
- Bootstrap (CSS)

## TECNOLOGIAS BACK-END

- Node.js
- Express.js
- MongoDB
- Mongoose

## INTRODUÇÃO

Ao analisar a cidade de Picos-PI, notou-se alguns problemas sofridos pela população que visita a cidade em busca de saúde. Essas pessoas acabam tendo uma dificuldade de encontrar o local de saúde que deseja, seja ele uma clínica ou hospital, ou até mesmo não possuem conhecimento que existe uma clínica que oferece certa especialidade na cidade. A proposta desse projeto é criar um sistema onde as pessoas terão acesso ao perfil dos hospitais e das clínicas contendo suas devidas informações, como as especialidades médicas, localização, dia e horário. Minimizando assim, o número de pessoas desinformadas quanto às clínicas ou hospitais presentes na cidade de Picos-PI.

## BRIEFING

Na cidade de Picos, há um certo número de pessoas (que habitam na região ou não) que têm uma certa dificuldade de encontrar hospitais e clínicas que supram suas necessidades. Com base no Instituto Brasileiro Geográfico (IBGE), cerca de 58 municípios abrangem a região de Picos e sua população flutuante chega a ser 3 mil pessoas por dia. Com o objetivo de ajudar essas pessoas, foi criada uma plataforma que permite o usuário ter acesso às informações específicas como a localização do hospital e da clínica, informando horário de atendimento, contatos e um mapa de apoio ao usuário garantindo uma localização rápida e precisa do hospital e da clínica. Chegando a uma solução para os problemas, a plataforma (Web-Saúde), analisando todos os dados coletados através de uma pesquisa com várias pessoas de ambas as regiões, obteve-se uma grande capacidade para resolver os problemas de forma que os usuários possam estar satisfeitos, pensando nos beneficiados, as pessoas de Picos e macrorregiões.
