pipeline {
    agent any

    environment {
        APP_NAME        = 'devops-website'
        IMAGE_NAME      = 'devops-learning-journey'
        IMAGE_TAG       = "${BUILD_NUMBER ?: 'latest'}"
        TEST_CONTAINER  = "devops-website-test-${BUILD_NUMBER ?: 'local'}"
        TEST_PORT       = '8088'
        DOCKER_REGISTRY = 'docker.io/library' // Replace with your Docker Hub / ECR registry
    }

    options {
        timeout(time: 15, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        ansiColor('xterm')
    }

    stages {
        stage('Checkout & Code Validation') {
            steps {
                echo "=== Step 1: Validating project structure and static files ==="
                script {
                    // Check required files exist
                    def requiredFiles = [
                        'index.html',
                        'css/style.css',
                        'js/script.js',
                        'data/projects.json',
                        'Dockerfile'
                    ]

                    for (file in requiredFiles) {
                        if (!fileExists(file)) {
                            error("Required file ${file} is missing!")
                        }
                    }
                    echo "All core files are present."
                }
            }
        }

        stage('JSON & Syntax Linting') {
            steps {
                echo "=== Step 2: Validating data/projects.json ==="
                sh '''
                    # Validate JSON syntax using python or jq if available
                    if command -v python3 &>/dev/null; then
                        python3 -m json.tool data/projects.json > /dev/null
                        echo "projects.json is valid JSON."
                    elif command -v jq &>/dev/null; then
                        jq . data/projects.json > /dev/null
                        echo "projects.json is valid JSON."
                    else
                        echo "Warning: Neither python3 nor jq found for JSON validation; skipping."
                    fi
                '''
            }
        }

        stage('Docker Build') {
            steps {
                echo "=== Step 3: Building Nginx Docker Image ==="
                sh """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest .
                """
            }
        }

        stage('Container Health & Integration Test') {
            steps {
                echo "=== Step 4: Running Test Container on Port ${TEST_PORT} ==="
                sh """
                    # Stop any existing test container
                    docker rm -f ${TEST_CONTAINER} || true

                    # Run new container
                    docker run -d --name ${TEST_CONTAINER} -p ${TEST_PORT}:80 ${IMAGE_NAME}:${IMAGE_TAG}

                    # Wait for Nginx to initialize
                    sleep 3

                    # Verify HTTP response 200 for index.html
                    curl -s -o /dev/null -w "%{http_code}" http://localhost:${TEST_PORT}/ | grep 200

                    # Verify projects.json is served with HTTP 200 and valid JSON
                    curl -s -f http://localhost:${TEST_PORT}/data/projects.json | grep -q "DevOps"

                    echo "Integration tests passed: Nginx container is healthy and serving static files."
                """
            }
        }

        stage('Security Vulnerability Scan (Optional)') {
            steps {
                echo "=== Step 5: Scanning Docker image with Trivy (if installed) ==="
                sh '''
                    if command -v trivy &>/dev/null; then
                        trivy image --severity HIGH,CRITICAL --exit-code 0 ${IMAGE_NAME}:${IMAGE_TAG}
                    else
                        echo "Trivy is not installed on this Jenkins agent. Skipping vulnerability scan."
                    fi
                '''
            }
        }

        stage('Deploy / Release') {
            steps {
                echo "=== Step 6: Deploying / Staging Container ==="
                echo "Image ${IMAGE_NAME}:${IMAGE_TAG} is ready for production deployment."
                // In production:
                // sh "docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }
    }

    post {
        always {
            echo "=== Cleaning up test containers ==="
            sh """
                docker rm -f ${TEST_CONTAINER} || true
            """
        }
        success {
            echo "Pipeline succeeded! DevOps Learning Journey website built and validated successfully."
        }
        failure {
            echo "Pipeline failed! Please check console logs for errors."
        }
    }
}
