import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

// formato da data pode ser passado de acordo com o metodo format do date-fns
// https://date-fns.org/v2.27.0/docs/format

export const formatarData = (data: Date | string | any, formato: string) => {
    const dataObjeto = new Date(data);
    return format(dataObjeto, formato, { locale: ptBR });
};
