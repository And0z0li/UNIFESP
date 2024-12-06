#include "funcs.h"

T_Buff *allocate_buffer(){
    T_Buff *buffer = malloc(sizeof(T_Buff));
    buffer->carac  = malloc(maxTam*sizeof(char));
    buffer->nextChar = 0;
    buffer->linha = 0;
    return buffer ;
}

void deallocate_buffer(T_Buff *buffer){
	free(buffer->carac);
	free(buffer);

} 
void get_next_char(char string[],T_Buff *buffer ){
    buffer->carac=string;

    printf("char : %c\n",buffer->carac[buffer->nextChar]);
    buffer->nextChar++;
}

bool isLetter(char strg[]){
    bool YesssNooo = true;
    int j=0;
    while (strlen(strg) > j && strg[j] != '\0' && YesssNooo){
        /* code */
        if((strg[j] >= 65 && strg[j] <= 90) || (strg[j] >= 97 && strg[j] <= 122) || strg[j]== 44 || strg[j]== 58 || strg[j]== 59)
            YesssNooo= true;
        else    
            YesssNooo=false;
        j++;
    }
    return YesssNooo ;
}

bool isReservedWord( char str[], char tokens[][maxTam]) {
    for (int i = 0; i < numTokens; i++) {
        if (strcmp(tokens[i], str) == 0) {
            return true;  // Palavra reservada encontrada
        }
    }
    return false;  // Não é uma palavra reservada
}

void replace_print( char carac[]){
    int i=0;
   
    
    while(carac[i]!= '\0'){
        char UPPER=carac[i];
        if(UPPER > 96 && UPPER < 123)
            printf("%c",UPPER-32);
        else
        printf("%c",UPPER);
        i++;
    }
}

void montaTipoPrint( char lexema[],char token[], int linha){
    tipoPrint *print = malloc(sizeof(tipoPrint));
    print->linha  = linha;
    strcpy(print->lexema,lexema);
    strcpy(print->token,token);
    printaToken(print);

    free(print);
}
void printaToken(tipoPrint  *token){
    printf("Linha: %d, Lexema: %s, Token: %s\n",token->linha,token->lexema,token->token);
}