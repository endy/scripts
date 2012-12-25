
set COMMANDEXE=echo
set ARGS=argsargsargs
set TESTLIST=list.txt

@echo off
@for /F "eol=# tokens=1*" %%i IN (%TESTLIST%) DO (  
    %COMMANDEXE%  %ARGS% %%i

)

pause