
pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-cred'
        DOCKER_IMAGE          = 'sreelakshmins2004/devops-website'
        SONAR_SERVER_NAME     = 'sonarqube-env'
        SONAR_SCANNER_TOOL    = 'sonar-scanner'
        GIT_CREDENTIALS_ID    = 'github-cred'
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                echo "Checking out source code from GitHub..."
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool "${SONAR_SCANNER_TOOL}"
                    withSonarQubeEnv("${SONAR_SERVER_NAME}") {
                        sh "${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=devops-website \
                            -Dsonar.projectName='DevOps Website' \
                            -Dsonar.sources=. \
                            -Dsonar.exclusions=Jenkinsfile,Dockerfile"
                    }
                }
            }
        }

        stage('File Verification') {
            steps {
                echo "Verifying website files..."
                sh '''
                    test -f index.html
                    test -f css/style.css
                    test -f js/script.js
                    test -f data/projects.json
                    test -f Dockerfile
                '''
                echo "All required website files are verified."
            }
        }

        stage('Build & Post Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS_ID}",
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh """
                            echo "\$DOCKER_PASS" | docker login -u "\$DOCKER_USER" --password-stdin

                            docker build -t ${DOCKER_IMAGE}:${env.BUILD_NUMBER} -t ${DOCKER_IMAGE}:latest -f ./Dockerfile .

                            docker push ${DOCKER_IMAGE}:${env.BUILD_NUMBER}
                            docker push ${DOCKER_IMAGE}:latest
                        """
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    sh """
                        docker pull ${DOCKER_IMAGE}:${env.BUILD_NUMBER}

                        docker stop devops-website || true
                        docker rm devops-website || true

                        docker run -d \
                            --name devops-website \
                            -p 80:80 \
                            ${DOCKER_IMAGE}:${env.BUILD_NUMBER}
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully! DevOps website deployed to EC2.'
        }
        failure {
            echo 'Pipeline failed. Please review the stage logs above.'
        }
    }
}
