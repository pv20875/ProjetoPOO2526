@echo off

cd frontend || (
echo Pasta 'frontend' nao encontrada...
    pause
    exit /b
)

if not exist node_modules (
    echo A instalar dependencias...
    npm install || (
        echo Ocorreu um erro ao instalar as dependencias...
        pause
        exit /b
    )
) else (
    echo As dependencias ja se encontram instaladas!
)

npm run start:dev
pause
