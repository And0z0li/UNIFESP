/*

auto	else	long	switch
break	enum	register	typedef
case	extern	return	union
char	float	short	unsigned
const	for	signed	void
continue	goto	sizeof	volatile
default	if	static	while
do	int	struct	_Packed
double


 gcc -o main main.c funcs.c
 valgrind --leak-check=yes ./main.exe  lexemas.c

*/

#include "funcs.h"


int main (int argc, char  **argv){
    int i,tam_BUFFER;
    char string_aux[maxTam],caracter;

    char tokens[numTokens][maxTam] = {
        "auto", "else", "long", "switch",
        "break", "enum", "register", "typedef",
        "case", "extern", "return", "union",
        "char", "float", "short", "unsigned",
        "const", "for", "signed", "void",
        "continue", "goto", "sizeof", "volatile",
        "default", "if", "static", "while",
        "do", "int", "struct", "_Packed",
        "double"
    };

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
    

    do {
        caracter = fgetc(arquivo);
        int i=0;

        while(caracter!='\n'  && i < maxTam && caracter != EOF && caracter != ' ' ){
            string_aux[i]=caracter;
            caracter = fgetc(arquivo);
            i++;
        }

        string_aux[i]='\0';
        Buffer->linha++;

        if(isLetter(string_aux) && string_aux[0] != '\0')
            if( isReservedWord( string_aux,  tokens) )
                printf("'%s'\n",string_aux);

    }while( caracter!= EOF );

    deallocate_buffer(Buffer);
    fclose(arquivo);
    return 0;
}

