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
 Windows -> ./main.exe
 linux   -> ./main

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
        
        
        //Stopping conditions for string storage
        // 61 -> = | 13-> carriage return | 59 -> ; | 58 -> : | 44 -> , 
        while(caracter!='\n'  && i < maxTam && caracter != EOF && caracter != ' ' && caracter != 61 && caracter != 13 && caracter != 59 && caracter != 44 && caracter != 58 ){
            string_aux[i]=caracter;
            caracter = fgetc(arquivo);
            i++;
        }

        string_aux[i]='\0';
        

        if(isLetter(string_aux) && string_aux[0] != '\0'){
            if( isReservedWord( string_aux,  tokens) )

                montaTipoPrint(string_aux,string_aux,Buffer->linha);   
            else

                montaTipoPrint(string_aux,"ID",Buffer->linha); 
        }else if (isNumber(string_aux) && string_aux[0] != '\0'){

            montaTipoPrint(string_aux,"NUM",Buffer->linha); 
        }
        if(caracter == '\n')
            Buffer->linha++;

    }while( caracter!= EOF  ); 

    deallocate_buffer(Buffer);
    fclose(arquivo);
    return 0;
}

