/*

    Transforma todos os caracteres minusculos em maiusculos.
    Uitlizando uma struct de Buffer alocada dinamicamente, com tamanho definido por linha de comando.

 gcc -o main main.c funcs.c
 valgrind --leak-check=yes ./main  ex1.txt 5

*/

#include "funcs.h"


int main (int argc, char  **argv){
    int i,tam_BUFFER;
    T_Buff *Buffer;
	if(argc != 3){
		printf("Numero de parametros invalido!\n");
		exit(1);
	}

    tam_BUFFER = atoi(argv[2]);
    FILE *arquivo = fopen(argv[1], "r");// testa se o arquivo foi aberto com sucesso

    if(arquivo != NULL)
        printf("Arquivo foi aberto com sucesso.");
    else
        printf("ERRO - arquivo");
    

    printf("\ntam_BUFFER - %d ", tam_BUFFER);
    printf("\nargv - %s\n",argv[1]);

    Buffer=allocate_buffer(tam_BUFFER);

    while (fgets(Buffer->carac, Buffer->tam,arquivo) != NULL){
        // printf("%s\n",Buffer->carac);
        replace_print(Buffer->carac);
    }

    deallocate_buffer(Buffer);
    fclose(arquivo);
    return 0;
}

