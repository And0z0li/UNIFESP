
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

bool  isNum(char carac){

    if (carac > 47 && carac < 58)
        return true;
    else
        return false;  
}

bool  isCarac(char carac){

    if ((carac > 64 && carac < 91) ||
        (carac > 96 && carac < 123)
    )
        return true;
    else
        return false;  
}


const int matriz[3][3] = {

//  Let  Dig  out
    { 1,  2,  2},  // estado 1 - Inicio
    { 1,  1,  2},  // estado 2 - letra/dig
    { 2,  2,  2},  // estado 3 - Fim 
};



int main (int argc, char *argv[]){

    if (argc < 2) {
        printf("Numero de argumentos invalidos");
    }

    FILE *arquivo = fopen(argv[1], "r");
    int estados[3];
    int carac; 
    int estadoAtual = 0;
    estados[0] = 0;

    char palavra[10];
    int aux_palavra=0;
    
    while ((carac = fgetc(arquivo)) != EOF) {

        switch (estadoAtual)
        {
        case 0 :
            if(isCarac(carac)){ 
                estadoAtual=matriz[estadoAtual][1]; 
                palavra[aux_palavra]=carac;
                aux_palavra++;
            }else 
                estadoAtual=-1; 
            break;
        case 1 :
            if(isCarac(carac) || isNum(carac))
                estadoAtual=matriz[estadoAtual][1]; 
            else
                estadoAtual=matriz[estadoAtual][2];
            break;
        case 2 :
            printf("%s \n", palavra);
            memset(palavra, 0, sizeof(palavra));
            break;
                
        default:
            printf("default : %c\n",carac);
            break;
        }

        /*
            if(isCarac(carac)){
                palavra[aux_palavra]=carac;
                aux_palavra++;

            }else if (isNum(carac)){

                if (aux_palavra != 0)
                    printf("%s \n", palavra);
                memset(palavra, 0, sizeof(palavra));
                aux_palavra=0;
                //printf("Numero\n");
            }else{
                if (aux_palavra != 0)
                    printf("%s \n", palavra);
                memset(palavra, 0, sizeof(palavra));
                aux_palavra=0;
            }
        */
    }

    fclose(arquivo);
    return 0;

}