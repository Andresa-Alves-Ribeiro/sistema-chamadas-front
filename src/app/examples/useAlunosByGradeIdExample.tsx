import React from 'react';
import { useAlunosByGradeId } from '../hooks/useAlunos';
import { Student } from '../types';

interface Props {
  gradeId: string; // ID da turma como string (ex: "nova-turma-id")
}

export const AlunosByGradeIdExample: React.FC<Props> = ({ gradeId }) => {
  const { alunos, loading, error, fetchAlunosByGradeId } = useAlunosByGradeId(gradeId);

  if (loading) {
    return <div>Carregando alunos da turma...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div>
      <h2>Alunos da Turma {gradeId}</h2>
      <button onClick={fetchAlunosByGradeId}>
        Recarregar Alunos
      </button>
      
      <div>
        {alunos.map((aluno: Student) => (
          <div key={aluno.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{aluno.name}</h3>
            <p>ID: {aluno.id}</p>
            <p>Turma: {aluno.grade}</p>
            <p>Período: {aluno.time}</p>
            <p>Grade ID: {aluno.gradeId}</p>
            
            {aluno.transferred && (
              <div style={{ background: '#f0f8ff', padding: '10px', margin: '5px 0' }}>
                <h4>Informações de Transferência:</h4>
                <p>Remanejado: {aluno.transferred ? 'Sim' : 'Não'}</p>
                <p>Data da Transferência: {aluno.transferDate}</p>
                <p>Turma Original: {aluno.originalGradeId}</p>
                <p>Nova Turma: {aluno.newGradeId}</p>
                
                {aluno.transfer_info && (
                  <div style={{ background: '#e8f4fd', padding: '8px', margin: '5px 0' }}>
                    <h5>Detalhes da Transferência:</h5>
                    <p>Data: {aluno.transfer_info.transfer_date}</p>
                    
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div>
                        <h6>Turma Original:</h6>
                        <p>ID: {aluno.transfer_info.original_grade.id}</p>
                        <p>Série: {aluno.transfer_info.original_grade.grade}</p>
                        <p>Período: {aluno.transfer_info.original_grade.time}</p>
                      </div>
                      
                      <div>
                        <h6>Turma Atual:</h6>
                        <p>ID: {aluno.transfer_info.current_grade.id}</p>
                        <p>Série: {aluno.transfer_info.current_grade.grade}</p>
                        <p>Período: {aluno.transfer_info.current_grade.time}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div>
        <p>Total de alunos: {alunos.length}</p>
      </div>
    </div>
  );
};

export const ExemploUso: React.FC = () => {
  const gradeId = "nova-turma-id"; // Exemplo de ID da turma
  
  return (
    <div>
      <h1>Exemplo de Uso do Hook useAlunosByGradeId</h1>
      <AlunosByGradeIdExample gradeId={gradeId} />
    </div>
  );
};

export default AlunosByGradeIdExample;
