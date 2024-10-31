/*



 gcc -o main main.c funcs.c
 valgrind --leak-check=yes ./main.exe  ex2.txt

*/

#include "funcs.h"


int main (int argc, char  **argv){
    int i,tam_BUFFER;
    char caracter;
    T_Buff *Buffer;
	if(argc != 2){
		printf("Numero de parametros invalido!\n");
		exit(1);
	}

    FILE *arquivo = fopen(argv[1], "r");// testa se o arquivo foi aberto com sucesso

    if(arquivo != NULL)
        printf("Arquivo foi aberto com sucesso.");
    else
        printf("ERRO - arquivo");
    

    printf("\nargv - %s\n",argv[1]);

    Buffer=allocate_buffer();

    caracter = fgetc(arquivo);
    while( caracter!='\n'  && caracter!= EOF && Buffer->nextChar < 256 ){

        Buffer->carac[Buffer->nextChar]=caracter;

        caracter = fgetc(arquivo);
        Buffer->nextChar++;

    }
    Buffer->carac[Buffer->nextChar]='\0';
    printf("%s",Buffer->carac);


    deallocate_buffer(Buffer);
    fclose(arquivo);
    return 0;
}

