
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
    FILE *saida = fopen("saida.txt", "w");

    int estados[3];
    int carac; 
    int estadoAtual = 0;
    estados[0] = 0;

    char palavra[20];
    int aux_palavra=0;
    
    while ((carac = fgetc(arquivo)) != EOF) {
       // printf("-%c-", carac);
       
        switch (estadoAtual)
        {
        case 0 :
            if(isCarac(carac)){ 
                //printf("asccii - %d |",carac);
                estadoAtual=matriz[estadoAtual][0]; 
                palavra[aux_palavra]=carac;
                palavra[aux_palavra+1]='\0';
                aux_palavra++;
            }else 
                estadoAtual=0; 
            break;
        case 1 :
            if(isCarac(carac) || isNum(carac)){
                //printf("asccii - %d |",carac);
                estadoAtual=matriz[estadoAtual][1];
                palavra[aux_palavra]=carac;
                palavra[aux_palavra+1]='\0';
                aux_palavra++; 
            }else
                estadoAtual=matriz[estadoAtual][2];
            break;
        case 2 :
            printf("%s \n", palavra);
            fputs(" ID ",saida);
            memset(palavra, 0, sizeof(palavra));
            aux_palavra=0;
            estadoAtual=0; 
            if(isCarac(carac) || isNum(carac)){
                palavra[aux_palavra]=carac;
                palavra[aux_palavra+1]='\0';
                aux_palavra++;
            }            
            break;
                
        default:
            //printf("default : %c\n",carac);
            break;
        }
        if(!isCarac(carac) && !isNum(carac) )
            fputc(carac,saida);

    }

    fclose(arquivo);
    fclose(saida);
    return 0;

}