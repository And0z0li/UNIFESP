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
    char string_aux[256];
    caracter = fgetc(arquivo);
    int scanfValue=0;
    bool computacao=true;

    while( caracter!= EOF  ){
        // Buffer=allocate_buffer();
        
        int i=0;

        while(caracter!='\n'  && i < 256 && caracter != EOF  ){
            string_aux[i]=caracter;
            caracter = fgetc(arquivo);
            i++;
        }
        string_aux[i]='\0';
        Buffer->linha++;

        while( computacao &&  string_aux[Buffer->nextChar] != '\0' && Buffer->nextChar < 256){
            printf("digite 1 para um novo caracter, 2 para sair.\n");
            scanf("%d",&scanfValue);
            if(scanfValue <= 1)
                get_next_char(string_aux,Buffer);
            else 
                computacao = false;
        }
        Buffer->nextChar=0;
        
        

        // deallocate_buffer(Buffer);
        caracter = fgetc(arquivo);
    }


    deallocate_buffer(Buffer);
    fclose(arquivo);
    return 0;
}

