import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';

import { PessoasService } from '../../../shared/services/api/pessoas/PessoasService';
import { VTextField, VForm, useVForm } from '../../../shared/forms';
import { BaseLayout } from '../../../shared/layouts/BaseLayout';
import { DetailingTools } from '../../../shared/components';

interface IFormData {
  nomeCompleto: string;
  email: string;
  cidadeId: number;
}

export const PeopleDetail: React.FC = () => {
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();

  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ name, setName] = useState('');

  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true);

      PessoasService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/pessoas');
          } else {
            setName(result.nomeCompleto);
            formRef.current?.setData(result);
          }
        });
    } else {
      formRef.current?.setData({
        nomeCompleto: '',
        email: '',
        cidadeId: '',
      });
    }
  }, [id]);

  const handleSave = (data: IFormData) => {
    setIsLoading(true);

    if (id === 'nova') {
      PessoasService
        .create(data)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            if (isSaveAndClose()) {
              navigate('/pessoas');
            } else {
              navigate(`/pessoas/detalhe/${result}`);
            }
          }
        });
    } else {
      PessoasService
        .updateById(Number(id), { id: Number(id), ...data })
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            if (isSaveAndClose()) {
              navigate('/pessoas');
            }
          }
        });
    }
  };

  const handleDelete = (id: number) => {
    setIsLoading(true);

    if (confirm('Realmente deseja apagar ?')) {
      PessoasService.deleteById(id)
        .then(result => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro apagado com sucesso');
            navigate('/pessoas');
          }
        });
    }
  };

  return (
    <BaseLayout 
      title={id === 'nova' ? 'Nova pessoa' : name}
      toolbar={
        <DetailingTools 
          textButtonNew='Nova'
          showButtonSaveAndClose
          showButtonNew={id !== 'nova'}
          showButtonDelete={id !== 'nova'}

          whenClickInSave={save}
          whenClickInSaveAndClose={saveAndClose}          
          whenClickInDelete={() => handleDelete(Number(id))}
          whenClickInBack={() => navigate('/pessoas')}
          whenClickInNew={() => navigate('/pessoas/detalhe/nova')}
        />
      }
    >

      <VForm ref={formRef} onSubmit={handleSave}>
        <Box margin={1} display='flex' flexDirection='column' component={Paper} variant='outlined'>

          <Grid container direction='column' padding={2} spacing={2}>

            {isLoading &&
              (<Grid item>
                <LinearProgress variant='indeterminate' />
              </Grid>)
            }

            <Grid item>
              <Typography variant='h6'>Geral</Typography>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label='Nome Completo'
                  name='nomeCompleto'
                  disabled={isLoading}
                  onChange={e => setName(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField 
                  fullWidth
                  label='Email' 
                  name='email'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField 
                  fullWidth
                  label='Cidade'
                  name='cidadeId'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
            
          </Grid>

        </Box>
      </VForm>

    </BaseLayout>
  );
};